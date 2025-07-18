import React, { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { FaQuestionCircle } from 'react-icons/fa'

export interface HintToolTipProps {
  content: ReactNode | string
}

export default function HintToolTip({ content }: HintToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span><FaQuestionCircle color="gray" /></span>
      </TooltipTrigger>
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
