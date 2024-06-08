import { type HomeSearchParams } from '@/app/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getNextSearchParamsWithoutSelectedKey, getNextSearchParams } from '@/utils/link.utils'
import { getCurrentName, PICKER_NAME_KEY } from '@/utils/name.utils'
import { redirect } from 'next/navigation'

type PickerNameProps = {
    searchParams: HomeSearchParams
}

export const PickerName = ({
    searchParams,
}: PickerNameProps) => {
    const action = async (formData: FormData) => {
        'use server'

        if (!formData.get('name')) {
            redirect(getNextSearchParamsWithoutSelectedKey(searchParams, PICKER_NAME_KEY))
        } else {
            redirect(getNextSearchParams(searchParams, PICKER_NAME_KEY, (formData.get('name') as string)?.trim()))
        }
    }

    return (
        <form className="flex w-full flex-row items-end space-x-2" action={action}>
          <Input defaultValue={getCurrentName(searchParams)} type="text" name="name" placeholder='Bangkok, Chiang Mai, Mexico City...' />
          <Button type="submit">Search</Button>
        </form>
    )
}