import { auth } from "@/auth";
import ProfileContent from "@/components/profile-content";
import ProfileHeader from "@/components/profile-header";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className='container mx-auto space-y-6 px-4 py-10'>
      <ProfileHeader user={user} />
      <ProfileContent />
    </div>
  );
}
