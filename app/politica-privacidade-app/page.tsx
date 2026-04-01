import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos e Política de Privacidade do App | Café Canastra",
  description: "Termos e Condições Gerais de Uso e Política de Privacidade do App Café Canastra.",
  keywords: ["termos de uso", "política de privacidade", "LGPD", "café canastra", "app"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Termos e Política de Privacidade do App | Café Canastra",
    description: "Termos e Condições Gerais de Uso e Política de Privacidade do App Café Canastra.",
    type: "website",
  },
}

export default function PoliticaPrivacidadeAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Termos e Condições Gerais de Uso e Licenciamento
            </h1>
            <p className="text-gray-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Estes Termos e Condições de Uso (“Termos”) regulam a relação comercial e o licenciamento de uso entre a empresa <strong>Boaventura Cafés Especiais Ltda</strong>, pessoa jurídica de direito privado, doravante denominada “Café Canastra” ou “LICENCIANTE”, e a pessoa física ou jurídica que adquire a licença, doravante denominada “CLIENTE” ou “LICENCIADO”.
            </p>

            <p>
              O objeto deste instrumento é o regramento da utilização do software e plataforma denominado “<strong>App Café Canastra</strong>”.
            </p>

            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 my-6 font-semibold">
              AO CONTRATAR E UTILIZAR O APP CAFÉ CANASTRA, O CLIENTE DECLARA TER LIDO, COMPREENDIDO E ACEITO INTEGRALMENTE ESTES TERMOS.
            </div>

            <hr className="my-8" />

            <section className="mb-8" id="conceitos">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. CONCEITOS IMPORTANTES NESTES TERMOS</h2>
              <p>Para facilitar a leitura e interpretação deste documento, adotamos as seguintes definições:</p>
              <ul>
                <li><strong>Cliente (ou Licenciado)</strong>: Pessoa física ou jurídica que adquire a Licença de Uso do App Café Canastra.</li>
                <li><strong>App Café Canastra</strong>: Software desenvolvido e de propriedade exclusiva do Café Canastra. Trata-se de uma solução tecnológica que pode ser fornecida sob diferentes regimes de licenciamento.</li>
                <li><strong>Licença de Uso Anual</strong>: Modalidade de contratação que concede ao Cliente o direito de uso do App pelo período de 12 (doze) meses.</li>
                <li><strong>Usuário</strong>: Pessoa autorizada pelo Cliente a acessar o painel do sistema/aplicativo.</li>
              </ul>
            </section>

            <section className="mb-8" id="natureza">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. NATUREZA E EFICÁCIA DOS TERMOS</h2>
              <p><strong>2.1.</strong> Ao adquirir a Licença de Uso ou acessar a plataforma, o Cliente concorda integralmente com estes Termos. A aceitação destas regras é condição indispensável para a liberação do acesso, instalação e utilização do App Café Canastra.</p>
              <p><strong>2.2.</strong> A realização do pagamento ou o simples início da utilização do App Café Canastra implica, para todos os fins de direito, na aceitação plena, inequívoca e irrevogável de todas as condições estabelecidas nestes Termos e suas futuras atualizações.</p>
              <p><strong>2.3.</strong> O Cliente reconhece que estes Termos possuem força de contrato vinculante, substituindo quaisquer acordos verbais ou trocas de mensagens anteriores.</p>
              <p><strong>2.4.</strong> Pela teoria da aparência, o Café Canastra considerará válida a contratação realizada mediante o fornecimento de dados cadastrais e pagamento, declarando o Cliente que a pessoa responsável pela compra possui plenos poderes para representá-lo.</p>
              <p><strong>2.5.</strong> O Café Canastra poderá alterar estes Termos a qualquer momento. O uso continuado do sistema após a publicação das alterações confirma a aceitação dos novos Termos.</p>
            </section>

            <section className="mb-8" id="requisitos">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. REQUISITOS TÉCNICOS E CONDIÇÕES DE OPERAÇÃO</h2>
              <p>Para garantir a performance, segurança e estabilidade, o Cliente deve observar rigorosamente os requisitos técnicos compatíveis operando na nossa infraestrutura ou na sua própria (quando aplicável o modelo self-hosted/SaaS).</p>
              <p><strong>3.1. Veracidade das Informações:</strong> O Usuário deve fornecer informações verdadeiras, exatas e atuais. O Café Canastra reserva o direito de recusar o cadastro ou cancelar contas cujos Usuários adotem condutas contrárias a estes Termos ou aos valores da empresa.</p>
              <p><strong>3.2. Integrações Opcionais:</strong> Qualquer uso de APIs não oficiais incorre na isenção de garantia ou compromisso de disponibilidade de integrações de terceiros.</p>
            </section>

            <section className="mb-8" id="responsabilidades">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. DELIMITAÇÃO DE RESPONSABILIDADES E RELAÇÃO COM TERCEIROS</h2>
              <p><strong>4.1.</strong> Estes Termos disciplinam exclusivamente a relação comercial entre o Café Canastra e o Cliente (Licenciado).</p>
              <p><strong>4.2. Responsabilidade sobre Equipe:</strong> O Cliente é o único responsável pela gestão dos usuários da sua organização que utilizam a plataforma.</p>
              <p><strong>4.3. Restrições e Final Consumers:</strong> O Café Canastra atua como fornecedora da tecnologia, isentando-se das tratativas comerciais ou legais perante eventuais clientes finais do Cliente Licenciado.</p>
            </section>

            <section className="mb-8" id="licenca">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. OBJETO E LICENÇA DE USO</h2>
              <p><strong>5.1. Objeto:</strong> O contrato concede ao Cliente uma Licença de Uso de Software (Direito de Uso), não exclusiva, intransferível e temporária do App Café Canastra.</p>
              <p><strong>5.2. Restrições:</strong> Sob pena de cancelamento imediato e medidas judiciais, é vedado:</p>
              <ul>
                <li>Copiar, vender ou distribuir eventuais códigos-fonte.</li>
                <li>Realizar engenharia reversa ou descompilação.</li>
                <li>Sublicenciamento indevido ou distribuição pirata.</li>
              </ul>
            </section>

            <section className="mb-8" id="planos">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. PLANOS, PAGAMENTO, RENOVAÇÃO E CANCELAMENTO</h2>
              <p><strong>6.1. Natureza da Contratação:</strong> A aquisição pode ser realizada via planos de assinatura, mediante pagamento único para período estabelecido (ex: Anual).</p>
              <p><strong>6.2. Renovação:</strong> Ao término da vigência estabelecida, caso não seja habilitada a renovação ou optando o cliente por cancelar, o acesso será regredido e, em caso de não renovação do ciclo da referida licença, o acesso poderá ser bloqueado.</p>
              <p><strong>6.3. Prazo de Arrependimento (7 Dias):</strong> Em conformidade com o Art. 49 do CDC, o Cliente poderá solicitar o cancelamento e reembolso em até 07 (sete) dias corridos após a primeira assinatura.</p>
            </section>

            <section className="mb-8" id="suporte">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. POLÍTICA DE SUPORTE TÉCNICO E SLA</h2>
              <p><strong>7.1. Canais e Horários:</strong> O suporte será realizado mediante portal exclusivo (ou e-mail comercial) de Segunda a Sexta, em dias úteis, horário comercial.</p>
              <p><strong>7.2. Escopo do Suporte:</strong> Limitado ao esclarecimento de dúvidas e resolução de instabilidades nativas da plataforma App Café Canastra. Não inclui customizações privadas nem configuração de serviços prestados por terceiros.</p>
            </section>

            <section className="mb-8" id="obrigacoes">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. OBRIGAÇÕES, RESPONSABILIDADES E LIMITAÇÕES</h2>
              <p><strong>8.1.</strong> Riscos inerentes: O Cliente reconhece que o sistema está sujeito a interferências ou atrasos inerentes ao uso da internet. Falhas decorrentes de fatores externos não constituem defeito de software e isentam a licenciante de indenizações.</p>
            </section>

            <section className="mb-8" id="propriedade">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. PROPRIEDADE INTELECTUAL</h2>
              <p><strong>9.1. Titularidade:</strong> O App Café Canastra, código-fonte, bases de dados, logotipos oficiais do Café Canastra são de propriedade intelectual exclusiva da Licenciante.</p>
              <p>A contratação desta licença não transfere e nem afeta o escopo de propriedade da Licenciante.</p>
            </section>

            <section className="mb-8" id="privacidade">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)</h2>
              <p><strong>10.1. Papéis das Partes (Definição de Controlador e Operador):</strong> Para fins da LGPD (Lei nº 13.709/2018):</p>
              <ul>
                <li><strong>O Café Canastra</strong> atua como Controladora apenas dos dados cadastrais do Cliente Direto (nome, e-mail, numeração fiscal, telefone) contidos no faturamento do referido produto.</li>
                <li><strong>Cliente como Controlador:</strong> O Cliente é o único Controlador de dados e fluxos provenientes de seus próprios clientes finais ou terceiros por intermédio da plataforma, eximindo a Licenciante de responsabilidade.</li>
              </ul>
              <p><strong>10.2. Segurança e Vazamentos:</strong> O Café Canastra aplica as devidas regras e cautelas nos padrões normais de indústria para zelar pelo produto, porém cabe ressaltar as ressalvas de invasão ou engenharia social.</p>
            </section>

            <section className="mb-8" id="disposicoes-gerais">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. DISPOSIÇÕES GERAIS</h2>
              <p><strong>11.1. Modificações:</strong> O Café Canastra poderá atualizar unilateralmente estes Termos e a continuidade de utilização valerá como confirmação de aceitação.</p>
              <p><strong>11.2. Conduta e Respeito:</strong> Reserva-se o direito de rescindir a licença caso o Cliente ou seus representantes tratem suas equipes técnicas com ofensas, racismo, injúria ou falta do devido respeito comercial.</p>
            </section>

            <section className="mb-8" id="foro">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. FORO E LEGISLAÇÃO APLICÁVEL</h2>
              <p>Este contrato é regido pelas leis da República Federativa do Brasil.</p>
              <p>Fica eleito o foro da Comarca de Uberlândia - MG, ou domicílio da sede fiscal do negócio, como competente para dirimir litígios oriundos deste termo.</p>
            </section>

            <section className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dúvidas ou Contato</h3>
              <p className="text-gray-700 mb-2">
                <strong>E-mail:</strong> <a href="mailto:comercial@cafecanastra.com" className="text-amber-600 hover:text-amber-700">comercial@cafecanastra.com</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Telefone:</strong> (34) 3226-2600
              </p>
              <p className="text-gray-700">
                <strong>Endereço:</strong> Rua Nivaldo Guerreiro Nunes, 701 - Distrito Industrial - Uberlândia/MG
              </p>
            </section>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Voltar ao Início
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
