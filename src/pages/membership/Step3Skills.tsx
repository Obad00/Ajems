import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NEEDS } from '../../schemas/common'
import { step3Schema, type Step3Input, type Step3Output } from '../../schemas/step3'
import { MultiSelect } from '../../ui/Choice'
import { TextArea } from '../../ui/Field'
import { ErrorSummary, RequiredNote, StepActions, type StepFormProps } from './shared'

export function Step3Skills({ values, onNext, onBack }: StepFormProps<Partial<Step3Input>>) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, submitCount },
  } = useForm<Step3Input, unknown, Step3Output>({ resolver: zodResolver(step3Schema), defaultValues: values })

  return (
    <form noValidate onSubmit={handleSubmit(() => onNext(getValues()))} className="space-y-6">
      <RequiredNote />
      <ErrorSummary errors={errors} submitCount={submitCount} />

      <TextArea
        id="skills"
        label="Compétences principales"
        hint="Par exemple : couture, gestion de stock, développement web, vente."
        rows={3}
        maxLength={500}
        error={errors.skills?.message}
        {...register('skills')}
      />
      <TextArea
        id="services"
        label="Services ou produits proposés"
        optional
        rows={3}
        maxLength={1000}
        error={errors.services?.message}
        {...register('services')}
      />
      <TextArea
        id="experience"
        label="Expérience professionnelle"
        optional
        rows={3}
        maxLength={1000}
        error={errors.experience?.message}
        {...register('experience')}
      />

      <MultiSelect
        name="needs"
        legend="Besoins prioritaires"
        optional
        hint="Plusieurs choix possibles."
        options={NEEDS}
        columns={2}
        error={errors.needs?.message}
        inputProps={register('needs')}
      />

      <TextArea
        id="needs_details"
        label="Précisions sur vos besoins"
        optional
        rows={3}
        maxLength={500}
        error={errors.needs_details?.message}
        {...register('needs_details')}
      />

      <StepActions onBack={() => onBack?.(getValues())} />
    </form>
  )
}
