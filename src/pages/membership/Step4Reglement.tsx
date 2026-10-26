import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { ACCEPTANCE_NOTICE, REGLEMENT } from '../../content/reglement'
import { makeStep4Schema, type Step4Input, type Step4Output } from '../../schemas/step4'
import { Alert } from '../../ui/Alert'
import { Checkbox } from '../../ui/Choice'
import { Field } from '../../ui/Field'
import { ReglementText } from '../../ui/ReglementText'
import { ErrorSummary, StepActions, type StepFormProps } from './shared'

type Props = StepFormProps<Partial<Step4Input>> & { firstName: string; lastName: string }

export function Step4Reglement({ values, onNext, onBack, firstName, lastName }: Props) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, submitCount },
  } = useForm<Step4Input, unknown, Step4Output>({
    resolver: zodResolver(makeStep4Schema(firstName, lastName)),
    defaultValues: values,
  })

  return (
    <form noValidate onSubmit={handleSubmit(() => onNext(getValues()))} className="space-y-6">
      <ErrorSummary errors={errors} submitCount={submitCount} />

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold text-navy">
            {REGLEMENT.title} <span className="font-normal text-muted">(version {REGLEMENT.version})</span>
          </p>
          <Link
            to="/reglement"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy underline underline-offset-4"
          >
            Version imprimable / PDF
            <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">(nouvel onglet)</span>
          </Link>
        </div>
        <div
          role="region"
          aria-label="Texte du règlement intérieur"
          tabIndex={0}
          className="max-h-80 overflow-y-auto rounded-lg border border-field bg-surface p-4 sm:p-5"
        >
          <p className="mb-4 text-sm font-semibold text-warn">{REGLEMENT.status}</p>
          <ReglementText />
        </div>
      </div>

      <Checkbox
        id="reglement_accepted"
        label={`J'ai lu et j'accepte le règlement intérieur (version ${REGLEMENT.version}).`}
        error={errors.reglement_accepted?.message}
        {...register('reglement_accepted')}
      />

      <Field
        id="full_name_typed"
        label="Votre nom complet"
        hint={`Tapez votre prénom et votre nom tels que saisis à l'étape 1 : ${firstName} ${lastName}.`}
        autoComplete="name"
        error={errors.full_name_typed?.message}
        {...register('full_name_typed')}
      />

      <Checkbox
        id="accuracy_confirmed"
        label="Je certifie l'exactitude des informations fournies."
        error={errors.accuracy_confirmed?.message}
        {...register('accuracy_confirmed')}
      />

      <Alert tone="info">
        <p>{ACCEPTANCE_NOTICE}</p>
        <p>
          <Link to="/confidentialite" className="font-semibold text-navy underline underline-offset-4">
            Comment vos données sont utilisées
          </Link>
        </p>
      </Alert>

      <StepActions onBack={() => onBack?.(getValues())} nextLabel="Voir le récapitulatif" />
    </form>
  )
}
