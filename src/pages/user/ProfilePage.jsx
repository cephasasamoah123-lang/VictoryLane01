import { useForm } from 'react-hook-form'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuthStore from '../../store/authStore'
import useToastStore from '../../store/toastStore'

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore()
  const showToast = useToastStore((state) => state.showToast)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  })

  const onSubmit = (data) => {
    updateProfile(data)
    showToast('Profile updated successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" {...register('name')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Address" {...register('address')} />
            <Button type="submit">Update Profile</Button>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm Password" type="password" />
            <Button type="submit">Change Password</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
