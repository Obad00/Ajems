import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { ZONE_LINKS } from '../../schemas/common'
import { step1Schema, type Step1Input, type Step1Output } from '../../schemas/step1'
import { AGE_RANGE, getAgeWarning } from '../../services/age'
import { Alert } from '../../ui/Alert'
import { RadioGroup } from '../../ui/Choice'
import { Field } from '../../ui/Field'
import { ErrorSummary, RequiredNote, StepActions, type StepFormProps } from './shared'

export function Step1Identity({ values, onNext }: StepFormProps<Partial<Step1Input>>) {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, submitCount },
  } = useForm<Step1Input, unknown, Step1Output>({ resolver: zodResolver(step1Schema), defaultValues: values })

  const birthYear = useWatch({ control, name: 'birth_year' })
  const ageWarning = /^\d{4}$/.test(birthYear ?? '') ? getAgeWarning(Number(birthYear)) : null

  return (
    <form noValidate onSubmit={handleSubmit(() => onNext(getValues()))} className="space-y-6">
      <RequiredNote />
      <ErrorSummary errors={errors} submitCount={submitCount} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="first_name" label="Prénom" autoComplete="given-name" error={errors.first_name?.message} {...register('first_name')} />
        <Field id="last_name" label="Nom" autoComplete="family-name" error={errors.last_name?.message} {...register('last_name')} />
      </div>

      <Field
        id="birth_year"
        label="Année de naissance"
        hint={`Par exemple 1996. L'adhésion s'adresse aux ${AGE_RANGE.min}–${AGE_RANGE.max} ans (règle à confirmer par le bureau).`}
        inputMode="numeric"
        autoComplete="bday-year"
        maxLength={4}
        className="sm:max-w-40"
        error={errors.birth_year?.message}
        after={ageWarning && <Alert tone="warning" role="status">{ageWarning}</Alert>}
        {...register('birth_year')}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="phone"
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          hint="Par exemple 77 123 45 67. Numéros étrangers : indiquez l'indicatif (+33…)."
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Field id="email" label="Email" optional type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="quartier" label="Quartier" autoComplete="address-level3" error={errors.quartier?.message} {...register('quartier')} />
        <Field id="commune" label="Commune" autoComplete="address-level2" error={errors.commune?.message} {...register('commune')} />
      </div>

      <RadioGroup
        name="zone_link"
        legend="Votre lien avec Mermoz-Sacré-Cœur"
        options={ZONE_LINKS}
        error={errors.zone_link?.message}
        inputProps={register('zone_link')}
      />

      <p className="text-sm text-muted">
        Vos informations servent uniquement à l'examen de votre adhésion.{' '}
        <Link to="/confidentialite" className="font-semibold text-navy underline underline-offset-4">
          Notice de confidentialité
        </Link>
      </p>

      <StepActions />
    </form>
  )
}
