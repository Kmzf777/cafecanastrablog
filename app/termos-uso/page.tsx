import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso | Café Canastra",
  description: "Conheça nossos termos de uso e condições para utilização do site e serviços do Café Canastra.",
  keywords: ["termos de uso", "condições", "café canastra", "política"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Termos de Uso | Café Canastra",
    description: "Conheça nossos termos de uso e condições para utilização do site e serviços.",
    type: "website",
  },
}

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e utilizar o site do Café Canastra (cafecanastra.com), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
              <p className="text-gray-700">
                Estes termos se aplicam a todos os visitantes, usuários e outros que acessem ou utilizem o site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 mb-4">
                O Café Canastra é um site informativo sobre café artesanal da Serra da Canastra, oferecendo:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Informações sobre nossos produtos de café</li>
                <li>Blog com receitas e notícias sobre café</li>
                <li>Conteúdo educativo sobre café especial</li>
                <li>Informações sobre nossa empresa e história</li>
                <li>Formulários de contato e newsletter</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso Aceitável</h2>
              <p className="text-gray-700 mb-4">Você concorda em utilizar o site apenas para propósitos legais e de acordo com estes termos. Você não deve:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Usar o site de forma que possa danificar, desabilitar ou sobrecarregar nossos servidores</li>
                <li>Tentar obter acesso não autorizado a qualquer parte do site</li>
                <li>Usar o site para transmitir vírus, malware ou código malicioso</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Usar o site para atividades ilegais ou fraudulentas</li>
                <li>Interferir na segurança ou integridade do site</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo o conteúdo do site, incluindo textos, imagens, gráficos, logotipos, ícones, software e outros materiais, é propriedade da Boaventura Cafés Especiais Ltda ou de seus licenciadores e está protegido por leis de direitos autorais.
              </p>
              <p className="text-gray-700 mb-4">
                Você pode visualizar, baixar e imprimir conteúdo para uso pessoal e não comercial, desde que mantenha todos os avisos de direitos autorais e outros avisos de propriedade.
              </p>
              <p className="text-gray-700">
                É proibida a reprodução, distribuição, modificação ou criação de trabalhos derivados sem autorização prévia por escrito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Conteúdo do Usuário</h2>
              <p className="text-gray-700 mb-4">
                Se você enviar comentários, sugestões ou outros conteúdos para o site, você nos concede uma licença não exclusiva, livre de royalties, para usar, reproduzir, modificar e distribuir esse conteúdo.
              </p>
              <p className="text-gray-700">
                Você é responsável por garantir que qualquer conteúdo enviado não viole direitos de terceiros ou seja ilegal, ofensivo ou inadequado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Links para Terceiros</h2>
              <p className="text-gray-700 mb-4">
                Nosso site pode conter links para sites de terceiros. Não endossamos ou assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de sites de terceiros.
              </p>
              <p className="text-gray-700">
                Recomendamos que você leia os termos de uso e políticas de privacidade de qualquer site que visite.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                Em nenhuma circunstância a Boaventura Cafés Especiais Ltda será responsável por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou impossibilidade de uso do site.
              </p>
              <p className="text-gray-700">
                O site é fornecido "como está" e "conforme disponível", sem garantias de qualquer natureza, expressas ou implícitas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disponibilidade do Site</h2>
              <p className="text-gray-700 mb-4">
                Nos esforçamos para manter o site disponível 24 horas por dia, 7 dias por semana, mas não garantimos disponibilidade contínua ou ininterrupta.
              </p>
              <p className="text-gray-700">
                Podemos suspender ou interromper o acesso ao site a qualquer momento para manutenção, atualizações ou por outros motivos técnicos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modificações dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação no site.
              </p>
              <p className="text-gray-700">
                É sua responsabilidade verificar periodicamente se houve alterações. O uso contínuo do site após as modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p className="text-gray-700 mb-4">
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais da comarca de Uberlândia, Estado de Minas Gerais.
              </p>
              <p className="text-gray-700">
                Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Rescisão</h2>
              <p className="text-gray-700 mb-4">
                Podemos rescindir ou suspender seu acesso ao site imediatamente, sem aviso prévio, por qualquer motivo, incluindo violação destes Termos de Uso.
              </p>
              <p className="text-gray-700">
                Após a rescisão, você não terá mais direito de acessar ou utilizar o site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Disposições Gerais</h2>
              <p className="text-gray-700 mb-4">
                Estes Termos de Uso constituem o acordo completo entre você e a Boaventura Cafés Especiais Ltda em relação ao uso do site.
              </p>
              <p className="text-gray-700">
                Se você tiver dúvidas sobre estes termos, entre em contato conosco antes de utilizar o site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contato</h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
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