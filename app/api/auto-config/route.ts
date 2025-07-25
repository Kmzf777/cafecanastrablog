import { NextResponse } from "next/server"

// Verificar se as variáveis de ambiente estão disponíveis
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (isSupabaseConfigured) {
  const { createClient } = require("@supabase/supabase-js")
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface AutoConfig {
  isEnabled: boolean
  startHour: number
  endHour: number
  modo: "automático" | "personalizado"
  tema: string
  publico_alvo: string
  updated_at?: string
}

// Converter de camelCase para snake_case
function toSnakeCase(obj: any): any {
  return {
    is_enabled: obj.isEnabled,
    start_hour: obj.startHour,
    end_hour: obj.endHour,
    modo: obj.modo,
    tema: obj.tema,
    publico_alvo: obj.publico_alvo,
    updated_at: obj.updated_at
  }
}

// Converter de snake_case para camelCase
function toCamelCase(obj: any): any {
  return {
    isEnabled: obj.is_enabled,
    startHour: obj.start_hour,
    endHour: obj.end_hour,
    modo: obj.modo,
    tema: obj.tema,
    publico_alvo: obj.publico_alvo,
    updated_at: obj.updated_at
  }
}

export async function GET() {
  try {
    // Se Supabase não estiver configurado, retornar configuração padrão
    if (!isSupabaseConfigured || !supabase) {
      console.log("Supabase não configurado, retornando configuração padrão")
      const defaultConfig: AutoConfig = {
        isEnabled: false,
        startHour: 7,
        endHour: 10,
        modo: "automático",
        tema: "",
        publico_alvo: ""
      }
      return NextResponse.json(defaultConfig)
    }

    const { data, error } = await supabase
      .from('auto_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao carregar configuração:', error)
      return NextResponse.json({ error: 'Erro ao carregar configuração' }, { status: 500 })
    }

    if (!data) {
      // Retornar configuração padrão se não existir
      const defaultConfig: AutoConfig = {
        isEnabled: false,
        startHour: 7,
        endHour: 10,
        modo: "automático",
        tema: "",
        publico_alvo: ""
      }
      return NextResponse.json(defaultConfig)
    }

    // Converter de snake_case para camelCase
    const camelCaseData = toCamelCase(data)
    return NextResponse.json(camelCaseData)
  } catch (error) {
    console.error('Erro ao carregar configuração:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Se Supabase não estiver configurado, simular sucesso
    if (!isSupabaseConfigured || !supabase) {
      console.log("Supabase não configurado, simulando salvamento")
      const config: AutoConfig = await request.json()
      
      // Adicionar timestamp
      const configWithTimestamp = {
        ...config,
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json(configWithTimestamp)
    }

    const config: AutoConfig = await request.json()
    
    // Validar dados
    if (typeof config.isEnabled !== 'boolean') {
      return NextResponse.json({ error: 'isEnabled deve ser um booleano' }, { status: 400 })
    }
    
    if (typeof config.startHour !== 'number' || config.startHour < 0 || config.startHour > 23) {
      return NextResponse.json({ error: 'startHour deve ser um número entre 0 e 23' }, { status: 400 })
    }
    
    if (typeof config.endHour !== 'number' || config.endHour < 0 || config.endHour > 23) {
      return NextResponse.json({ error: 'endHour deve ser um número entre 0 e 23' }, { status: 400 })
    }
    
    if (!['automático', 'personalizado'].includes(config.modo)) {
      return NextResponse.json({ error: 'modo deve ser "automático" ou "personalizado"' }, { status: 400 })
    }

    // Adicionar timestamp
    const configWithTimestamp = {
      ...config,
      updated_at: new Date().toISOString()
    }

    // Converter para snake_case para o banco
    const snakeCaseConfig = toSnakeCase(configWithTimestamp)

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('auto_config')
      .upsert([snakeCaseConfig], { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar configuração:', error)
      return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 })
    }

    // Converter de volta para camelCase
    const camelCaseData = toCamelCase(data)
    return NextResponse.json(camelCaseData)
  } catch (error) {
    console.error('Erro ao processar configuração:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 