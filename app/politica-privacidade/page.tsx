import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade | Café Canastra",
  description: "Conheça nossa política de privacidade e como protegemos seus dados pessoais no Café Canastra.",
  keywords: ["política de privacidade", "proteção de dados", "LGPD", "café canastra"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Política de Privacidade | Café Canastra",
    description: "Conheça nossa política de privacidade e como protegemos seus dados pessoais.",
    type: "website",
  },
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações Gerais</h2>
              <p className="text-gray-700 mb-4">
                A Boaventura Cafés Especiais Ltda ("Café Canastra", "nós", "nosso") está comprometida em proteger a privacidade e os dados pessoais de nossos clientes e visitantes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
              </p>
              <p className="text-gray-700">
                Ao utilizar nosso site, produtos ou serviços, você concorda com as práticas descritas nesta política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Informações Pessoais</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Endereço de entrega</li>
                <li>Informações de pagamento</li>
                <li>Data de nascimento (quando necessário)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Informações Automáticas</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Endereço IP</li>
                <li>Tipo de navegador</li>
                <li>Sistema operacional</li>
                <li>Páginas visitadas</li>
                <li>Tempo de permanência</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Como Usamos Suas Informações</h2>
              <p className="text-gray-700 mb-4">Utilizamos suas informações pessoais para:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Processar e entregar seus pedidos</li>
                <li>Comunicar sobre produtos, serviços e promoções</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Fornecer suporte ao cliente</li>
                <li>Cumprir obrigações legais</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Com prestadores de serviços que nos ajudam a operar nosso negócio</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos e propriedade</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <p className="text-gray-700">
                Utilizamos criptografia SSL para proteger dados transmitidos e armazenamos informações em servidores seguros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site, analisar o tráfego e personalizar conteúdo.
              </p>
              <p className="text-gray-700">
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Seus Direitos</h2>
              <p className="text-gray-700 mb-4">Você tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento</li>
                <li>Portabilidade dos dados</li>
                <li>Oposição ao processamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retenção de Dados</h2>
              <p className="text-gray-700">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política ou conforme exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Menores de Idade</h2>
              <p className="text-gray-700">
                Nosso site não é destinado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores de idade. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-gray-700">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas através de nosso site ou e-mail.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>E-mail:</strong>{" "}
                  <a href="mailto:comercial@cafecanastra.com" className="text-amber-600 hover:text-amber-700">
                    comercial@cafecanastra.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Telefone:</strong> (34) 3226-2600
                </p>
                <p className="text-gray-700">
                  <strong>Endereço:</strong> Rua Nivaldo Guerreiro Nunes, 701 - Distrito Industrial - Uberlândia/MG
                </p>
              </div>
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