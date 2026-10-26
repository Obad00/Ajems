import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LEGAL_STATUSES, MEMBER_TYPES, SECTORS } from '../../schemas/common'
import { step2Schema, type Step2Input, type Step2Output } from '../../schemas/step2'
import { MultiSelect, RadioGroup } from '../../ui/Choice'
import { Field, TextArea } from '../../ui/Field'
import { Select } from '../../ui/Select'
import { ErrorSummary, RequiredNote, StepActions, type StepFormProps } from './shared'

export function Step2Business({ values, onNext, onBack }: StepFormProps<Partial<Step2Input>>) {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, submitCount },
  } = useForm<Step2Input, unknown, Step2Output>({ resolver: zodResolver(step2Schema), defaultValues: values })

  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const memberType = useWatch({ control, name: 'member_type' })
  const sectors = useWatch({ control, name: 'sectors' }) ?? []
  const description = useWatch({ control, name: 'description' }) ?? ''

  return (
    <form noValidate onSubmit={handleSubmit(() => onNext(getValues()))} className="space-y-6">
      <RequiredNote />
      <ErrorSummary errors={errors} submitCount={submitCount} />

      <RadioGroup
        name="member_type"
        legend="Votre situation"
        options={MEMBER_TYPES}
        columns={2}
        error={errors.member_type?.message}
        inputProps={register('member_type')}
      />

      <Field
        id="business_name"
        label="Nom de l'entreprise ou du projet"
        autoComplete="organization"
        error={errors.business_name?.message}
        {...register('business_name')}
      />

      <MultiSelect
        name="sectors"
        legend="Secteurs d'activité"
        hint="Plusieurs choix possibles."
        options={SECTORS}
        columns={2}
        error={errors.sectors?.message}
        inputProps={register('sectors')}
      />

      {sectors.includes('autre') && (
        <Field id="sector_other" label="Précisez votre secteur" error={errors.sector_other?.message} {...register('sector_other')} />
      )}

      <TextArea
        id="description"
        label="Description de l'activité ou du projet"
        hint={`Ce que vous faites ou souhaitez faire, pour qui. ${description.trim().length}/1000 caractères.`}
        rows={5}
        maxLength={1000}
        error={errors.description?.message}
        {...register('description')}
      />

      {memberType === 'entrepreneur' && (
        <Field
          id="founded_on"
          label="Date de création de l'activité"
          optional
          type="date"
          max={today}
          className="sm:max-w-56"
          error={errors.founded_on?.message}
          {...register('founded_on')}
        />
      )}

      <Select
        id="legal_status"
        label="Statut juridique"
        optional
        options={LEGAL_STATUSES}
        error={errors.legal_status?.message}
        {...register('legal_status')}
      />

      <Field
        id="business_location"
        label="Localisation de l'activité"
        optional
        hint="Quartier, ville, ou « en ligne »."
        error={errors.business_location?.message}
        {...register('business_location')}
      />

      <Field
        id="links"
        label="Site web ou réseaux sociaux"
        optional
        hint="Un ou plusieurs liens, séparés par des virgules."
        error={errors.links?.message}
        {...register('links')}
      />

      <StepActions onBack={() => onBack?.(getValues())} />
    </form>
  )
}
