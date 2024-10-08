import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Separator } from './ui/separator'
import { OutlineButton } from './ui/outline-button'
import { useQuery } from '@tanstack/react-query'
import { gertSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { PendingGoals } from './pending-goals'

dayjs.locale(ptBR)
export function Summary() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: gertSummary,
    staleTime: 1000 * 60, // 1 min
  })

  if (!data) {
    return null
  }

  const firstDayOfWeel = dayjs().startOf('week').format('DD MMM')
  const lastDayOfWeel = dayjs().endOf('week').format('DD MMM')

  const percentCompleted = Math.round((data.completed * 100) / data.total)
  return (
    <div className="py-10 px-5 max-w-[480px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InOrbitIcon />
          <span>
            {firstDayOfWeel} - {lastDayOfWeel}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <Progress value={data.completed} max={data.total}>
        <ProgressIndicator style={{ width: `${percentCompleted}%` }} />
      </Progress>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          Você completou <span className="text-zinc-100">{data.completed}</span>{' '}
          de <span className="text-zinc-100">{data.total}</span> metas nessa
          semana.
        </span>
        <span>{percentCompleted}%</span>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {Object.entries(data.goalsPerDay).map(([date, goal]) => {
          const weekDay = dayjs(date).format('dddd')
          const formatDate = dayjs(date).format('DD [ de ] MMMM')
          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize">{weekDay}</span>{' '}
                <span className="text-zinc-400 text-xs">({formatDate})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goal.map(goal => {
                  const hours = dayjs(goal.completedAt).format('HH:mm')
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou “
                        <span className="text-zinc-100">{goal.title}</span>” às{' '}
                        <span className="text-zinc-100">{hours}h</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
