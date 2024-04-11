'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useContext, useState } from 'react';
import { UserProfileContext } from './user-profile-context';
import NewDropdownSearch from './new-dropdown-search';

type SelectedAddress = {
  sido: string;
  gungu: string;
  eupmyundong: string;
  li: string;
};

export type AddressDepth = 'sido' | 'gungu' | 'eupmyundong' | 'li';

export default function SelectAddress() {
  const { states, actions } = useContext(UserProfileContext);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    sido: '',
    gungu: '',
    eupmyundong: '',
    li: '',
  });
  const [currentDepth, setCurrentDepth] = useState<AddressDepth>('sido');
  const [error, setError] = useState('');

  const okButtonHandler = () => {
    // 선택한 주소의 code를 찾아야함
    const found = states.allAddresses.find(
      (ad) =>
        ad.sido === selectedAddress.sido &&
        ad.gungu === selectedAddress.gungu &&
        ad.eupmyundong === selectedAddress.eupmyundong &&
        ad.li === selectedAddress.li
    );
    console.log('found : ', found);
    if (!found) return;

    // 이미 userAddresses 에 있다면 처리하지 말고 모달 내리기
    const already = states.profile.addresses?.find((ua) => ua.code === found.code);
    if (already) {
      actions.setIsAddressModal(false);
      return;
    }

    actions.setProfile({
      ...states.profile,
      addresses: states.profile.addresses ? [...states.profile.addresses, found] : [found],
    });
    actions.setIsAddressModal(false);
  };

  const backgroundClickHandler = () => {
    actions.setIsAddressModal(false);
  };

  return (
    <div className="fixed top-0 text-start right-0 z-50 w-full h-screen flex items-center justify-center text-black">
      {/* 바깥 영역 클릭시 모달 내리기 */}
      <div onClick={backgroundClickHandler} className="absolute w-full h-full bg-neutral-600 opacity-30"></div>
      <div className="absolute bg-white rounded-md px-8 w-72 h-96 flex flex-col">
        <h1 className="mt-6 text-center">동네를 설정해주세요</h1>
        <div className="mt-10 flex flex-col gap-6">
          <NewDropdownSearch
            address={states.allAddresses}
            depth={'sido'}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            currentDepth={currentDepth}
            setCurrentDepth={setCurrentDepth}
          />
          <NewDropdownSearch
            address={states.allAddresses}
            depth={'gungu'}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            currentDepth={currentDepth}
            setCurrentDepth={setCurrentDepth}
          />
          <NewDropdownSearch
            address={states.allAddresses}
            depth={'eupmyundong'}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            currentDepth={currentDepth}
            setCurrentDepth={setCurrentDepth}
          />
        </div>
        {/* {error?.address && <p className="text-red-500">{error?.address}</p>} */}
        <CheckCircleIcon onClick={okButtonHandler} className="w-12 h-12 mt-5 self-center text-neutral-800" />
      </div>
    </div>
  );
}
