import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do Café Canastra. Conheça as condições e regras para utilização de nossos serviços e produtos.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Uso</h1>
            <p className="text-gray-600">Última atualização: 18 de janeiro de 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e utilizar o site <strong>cafecanastra.com</strong>, você concorda em cumprir e estar vinculado 
                a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
              <p className="text-gray-700">
                Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou utilizam o site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
              <p className="text-gray-700 mb-4">
                O <strong>Café Canastra</strong> oferece os seguintes serviços através de seu site:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Venda de cafés especiais e produtos relacionados</li>
                <li>Informações sobre produtos e processos de produção</li>
                <li>Blog com receitas e notícias sobre café</li>
                <li>Newsletter e comunicações promocionais</li>
                <li>Atendimento ao cliente e suporte</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Elegibilidade</h2>
              <p className="text-gray-700 mb-4">
                Para utilizar nossos serviços, você deve:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Ter capacidade legal para celebrar contratos</li>
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>Respeitar todas as leis aplicáveis</li>
              </ul>
              <p className="text-gray-700">
                Se você for menor de 18 anos, deve ter o consentimento de um responsável legal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Conta de Usuário</h2>
              <p className="text-gray-700 mb-4">
                Ao criar uma conta em nosso site, você é responsável por:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Manter suas informações pessoais atualizadas</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Produtos e Preços</h2>
              <p className="text-gray-700 mb-4">
                <strong>5.1 Disponibilidade:</strong> Todos os produtos estão sujeitos à disponibilidade. Reservamo-nos o direito 
                de descontinuar qualquer produto a qualquer momento.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>5.2 Preços:</strong> Os preços são mostrados em Reais (R$) e incluem impostos aplicáveis. 
                Reservamo-nos o direito de alterar preços a qualquer momento, sem aviso prévio.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>5.3 Imagens:</strong> As imagens dos produtos são meramente ilustrativas e podem variar 
                do produto real.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Pedidos e Pagamento</h2>
              <p className="text-gray-700 mb-4">
                <strong>6.1 Processamento:</strong> Todos os pedidos estão sujeitos à aprovação e disponibilidade. 
                Enviaremos confirmação por e-mail após o processamento.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>6.2 Pagamento:</strong> Aceitamos os métodos de pagamento disponibilizados no site. 
                O pagamento será processado no momento da confirmação do pedido.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>6.3 Cancelamento:</strong> Reservamo-nos o direito de cancelar pedidos em caso de 
                indisponibilidade de produto ou problemas de pagamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Entrega</h2>
              <p className="text-gray-700 mb-4">
                <strong>7.1 Prazos:</strong> Os prazos de entrega são estimativas e podem variar conforme 
                a região e disponibilidade.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>7.2 Responsabilidade:</strong> O risco de perda ou dano é transferido para você 
                no momento da entrega.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>7.3 Frete:</strong> As condições de frete serão informadas durante o processo de compra.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Trocas e Devoluções</h2>
              <p className="text-gray-700 mb-4">
                <strong>8.1 Direito de Arrependimento:</strong> Você tem o direito de desistir da compra 
                em até 7 (sete) dias corridos, contados da data de recebimento.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>8.2 Condições:</strong> O produto deve estar em sua embalagem original e sem sinais de uso.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>8.3 Reembolso:</strong> O reembolso será processado conforme as políticas de pagamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Uso Aceitável</h2>
              <p className="text-gray-700 mb-4">
                Você concorda em não utilizar nossos serviços para:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Atividades ilegais ou fraudulentas</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Transmitir vírus ou código malicioso</li>
                <li>Interferir no funcionamento do site</li>
                <li>Coletar informações de outros usuários sem autorização</li>
                <li>Enviar spam ou conteúdo inadequado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                <strong>10.1 Direitos:</strong> Todo o conteúdo do site, incluindo textos, imagens, logos, 
                marcas e software, é propriedade do Café Canastra ou de seus licenciadores.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>10.2 Uso:</strong> É proibida a reprodução, distribuição ou modificação sem autorização prévia.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>10.3 Marca:</strong> "Café Canastra" é uma marca registrada da Boaventura Cafés Especiais Ltda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                <strong>11.1 Serviços:</strong> Nossos serviços são fornecidos "como estão" e "conforme disponíveis". 
                Não garantimos que o site estará sempre disponível ou livre de erros.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>11.2 Danos:</strong> Em nenhuma circunstância seremos responsáveis por danos indiretos, 
                incidentais ou consequenciais.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>11.3 Limite:</strong> Nossa responsabilidade total será limitada ao valor pago pelos produtos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indenização</h2>
              <p className="text-gray-700 mb-4">
                Você concorda em indenizar e isentar o Café Canastra de qualquer reclamação, dano, perda ou 
                despesa (incluindo honorários advocatícios) decorrentes do uso inadequado de nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Rescisão</h2>
              <p className="text-gray-700 mb-4">
                Podemos suspender ou encerrar seu acesso aos serviços a qualquer momento, sem aviso prévio, 
                em caso de violação destes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Lei Aplicável</h2>
              <p className="text-gray-700 mb-4">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro 
                da comarca de Uberlândia/MG.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Alterações nos Termos</h2>
              <p className="text-gray-700 mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação no site. O uso continuado dos serviços após as 
                alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Disposições Gerais</h2>
              <p className="text-gray-700 mb-4">
                <strong>16.1 Integralidade:</strong> Estes termos constituem o acordo completo entre as partes.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>16.2 Divisibilidade:</strong> Se qualquer disposição for considerada inválida, 
                as demais permanecerão em vigor.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>16.3 Renúncia:</strong> A falha em exercer qualquer direito não constitui renúncia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Contato</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Boaventura Cafés Especiais Ltda</strong><br />
                  CNPJ: 24.252.228/0001-37
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Endereço:</strong><br />
                  Rua Nivaldo Guerreiro Nunes, 701<br />
                  Distrito Industrial - Uberlândia/MG
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Telefone:</strong> (34) 3226-2600
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>E-mail:</strong>{" "}
                  <a href="mailto:comercial@cafecanastra.com" className="text-amber-600 hover:text-amber-700">
                    comercial@cafecanastra.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Estes termos estão em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990) 
              e outras legislações aplicáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 