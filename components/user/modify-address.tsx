'use client';

import SelectAddress from '@/components/user/select-address';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { UserProfileContext } from './user-profile-context';
import { getLegalAddresses } from '@/lib/actions/location';

export default function ModifyAddress() {
  const { states: state, actions } = useContext(UserProfileContext);

  const handleModalClick = async () => {
    const address = await getLegalAddresses();
    console.log(address);

    actions.setAllAddresses(address);
    actions.setIsAddressModal(true);
  };

  return (
    <div className="flex items-center justify-center text-neutral-400 hover:myhover">
      <button className="flex flex-col items-center justify-center" onClick={handleModalClick}>
        <PlusCircleIcon className="w-10 h-10" />
        <span className="text-xs">동네 추가</span>
      </button>
      {state.allAddresses && state.isAddressModal && <SelectAddress />}
    </div>
  );
}
