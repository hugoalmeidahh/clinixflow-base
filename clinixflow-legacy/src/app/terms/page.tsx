
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-2xl font-bold'>Termos de Serviço</h1>
      <ol className='list-decimal pl-6'>
        <li>
          <strong>Termos</strong>
          <p>
            Ao acessar o Clinix Flow, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
          </p>
        </li>
        <li>
          <strong>Uso de Licença</strong>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Clinix Flow , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
          </p>
          <ul className='list-disc pl-6'>
            <li>modificar ou copiar os materiais;</li>
            <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
            <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Clinix Flow;</li>
            <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
            <li>transferir os materiais para outra pessoa ou &apos;espelhe&apos; os materiais em qualquer outro servidor.</li>
          </ul>
          <p>
            Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Clinix Flow a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
          </p>
        </li>
        <li>
          <strong>Isenção de responsabilidade</strong>
          <p>
            Os materiais no site da Clinix Flow são fornecidos &apos;como estão&apos;. Clinix Flow não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
          </p>
          <p>
            Além disso, o Clinix Flow não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
          </p>
        </li>
        <li>
          <strong>Limitações</strong>
          <p>
            Em nenhum caso o Clinix Flow ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Clinix Flow, mesmo que Clinix Flow ou um representante autorizado da Clinix Flow tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
          </p>
        </li>
        <li>
          <strong>Precisão dos materiais</strong>
          <p>
            Os materiais exibidos no site da Clinix Flow podem incluir erros técnicos, tipográficos ou fotográficos. Clinix Flow não garante que qualquer material em seu site seja preciso, completo ou atual. Clinix Flow pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Clinix Flow não se compromete a atualizar os materiais.
          </p>
        </li>
        <li>
          <strong>Links</strong>
          <p>
            O Clinix Flow não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Clinix Flow do site. O uso de qualquer site vinculado é por conta e risco do usuário.
          </p>
        </li>
        <li>
          <strong>Modificações</strong>
          <p>
            O Clinix Flow pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
          </p>
        </li>
        <li>
          <strong>Lei aplicável</strong>
          <p>
            Estes termos e condições são regidos e interpretados de acordo com as leis do Clinix Flow e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
          </p>
        </li>
      </ol>
      <Button>
        <Link href="/">Home</Link>
      </Button>
    </div>
  )
}
