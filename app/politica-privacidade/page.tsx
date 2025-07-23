import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade do Café Canastra. Saiba como coletamos, usamos e protegemos suas informações pessoais.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-gray-600">Última atualização: 18 de janeiro de 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-700 mb-4">
                A <strong>Boaventura Cafés Especiais Ltda</strong>, proprietária da marca <strong>Café Canastra</strong>, 
                está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, 
                usamos, armazenamos e protegemos suas informações pessoais quando você visita nosso site, 
                utiliza nossos serviços ou interage conosco.
              </p>
              <p className="text-gray-700">
                Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Informações que você nos fornece:</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Endereço de entrega</li>
                <li>Informações de pagamento</li>
                <li>Comentários e feedback</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Informações coletadas automaticamente:</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Endereço IP</li>
                <li>Tipo de navegador e versão</li>
                <li>Sistema operacional</li>
                <li>Páginas visitadas</li>
                <li>Tempo de permanência no site</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Como Usamos suas Informações</h2>
              <p className="text-gray-700 mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Processar e entregar seus pedidos</li>
                <li>Comunicar sobre pedidos, produtos e serviços</li>
                <li>Enviar newsletters e ofertas promocionais (com seu consentimento)</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Cumprir obrigações legais</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Prestadores de serviços essenciais (processamento de pagamento, entrega)</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Lembrar suas preferências</li>
                <li>Analisar o tráfego do site</li>
                <li>Melhorar a funcionalidade</li>
                <li>Personalizar conteúdo</li>
              </ul>
              <p className="text-gray-700">
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Segurança das Informações</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controle de acesso rigoroso</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Treinamento regular da equipe</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Seus Direitos</h2>
              <p className="text-gray-700 mb-4">Você tem o direito de:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Portabilidade dos dados</li>
                <li>Oposição ao processamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retenção de Dados</h2>
              <p className="text-gray-700 mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Fazer cumprir nossos acordos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Menores de Idade</h2>
              <p className="text-gray-700 mb-4">
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores de idade. Se você é pai ou responsável e acredita que 
                seu filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                mudanças significativas através de:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Notificação em nosso site</li>
                <li>E-mail para usuários registrados</li>
                <li>Data de "última atualização" no topo desta página</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas 
                informações pessoais, entre em contato conosco:
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
              <p className="text-gray-700 mb-4">
                Se você não estiver satisfeito com nossa resposta, pode entrar em contato com a ANPD:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Autoridade Nacional de Proteção de Dados</strong><br />
                  E-mail: atendimento@anpd.gov.br<br />
                  Telefone: (61) 2021-9600
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
              e outras legislações aplicáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 