import { auth } from '@/app/api/auth/[...nextauth]/auth';
import { getUserProfile } from '@/lib/actions/user';
import ModifyAddress from '../../../../components/user/modify-address';
import ContentEditor from '../../../../components/user/content-editor';
import ModifyFile from '../../../../components/user/modify-file';
import ProfileImage from '../../../../components/user/profile-image';
import SubmitButton from '../../../../components/user/submit-button';
import UserAddresses from '../../../../components/user/user-addresses';
import UserProfileContextProvider from '../../../../components/user/user-profile-context';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  const session = await auth();
  const isOwner = session?.user?.username === username;
  const userProfile = await getUserProfile(username);
  if (!userProfile) {
    redirect('/');
  }

  return (
    <UserProfileContextProvider userProfile={userProfile} isOwner={isOwner}>
      <section className="h-full sm:h-4/5 sm:mt-20 border rounded-lg overflow-y-scroll">
        <div className="w-full rounded-lg flex flex-col min-w-0 break-words bg-white">
          <div className="w-full my-2 flex flex-row justify-end px-4">
            {/* 저장 버튼 */}
            <SubmitButton />
          </div>
          <div className="px-6">
            <div className="relative w-full flex flex-col justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="w-full h-full flex flex-col items-center">
                  <ProfileImage />
                  <ModifyFile />
                </div>
              </div>
            </div>
            <div className="relative w-full text-center mt-12">
              <h3 className="text-xl font-semibold leading-normal mb-2">{userProfile?.username}</h3>
              <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                {userProfile?.babyMonths && `${userProfile.babyMonths} 개월 아기`}
              </div>
              <div className="mb-2 mt-10 w-full flex flex-col justify-center items-center gap-4">
                {/* 주소 추가 버튼 */}
                <ModifyAddress />
                {/* 주소 표시 */}
                <UserAddresses />
              </div>
            </div>
            <div className="mt-10 py-10 border-t text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                  {/* content 수정 textarea */}
                  <ContentEditor />
                  {/* <a className="font-normal text-pink-500">Show more</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </UserProfileContextProvider>
  );
}
