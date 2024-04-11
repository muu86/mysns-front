'use client';

import { useContext } from 'react';
import { UserProfileContext } from './user-profile-context';
import { AddressType } from '@/types/definitions';

export default function UserAddresses() {
  const { states, actions } = useContext(UserProfileContext);

  return (
    <div className="flex flex-row flex-wrap gap-3 px-4">
      {states.profile?.addresses && states.profile.addresses.map((ad, i) => <Inner key={i} address={ad} />)}
    </div>
  );
}

function Inner({ address }: { address: AddressType }) {
  return (
    <div>
      <span className="bg-neutral-200 rounded-md p-1">{address.eupmyundong}</span>
    </div>
  );
}
