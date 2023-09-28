import React from 'react';
import useScreen from 'hooks/useScreen';
import {useInstalledPlugins} from 'hooks/useInstalledPlugins';
import {useDaoDetailsQuery} from 'hooks/useDaoDetails';
import {useTranslation} from 'react-i18next';
import {IconReload} from '@aragon/ui-components/src/components/icons';
import {IconClose} from '@aragon/ui-components/src/components/icons';

export const ConfigureInstalledPlugins: React.FC = () => {
  const {isMobile} = useScreen();
  const {t} = useTranslation();
  const {data: daoDetails, isLoading: detailsAreLoading} = useDaoDetailsQuery();
  const {creditDelegation, subgovernance, uniswapV3, vault, pwn} =
    useInstalledPlugins(daoDetails?.address);

  const handleUpdate = (pluginId: string) => {};

  const handleUninstall = (pluginId: string) => {};

  return (
    <>
      <div className="text-ui-800 my-1 overflow-x-auto">
        <table className="w-full">
          <thead className="my-3">
            <tr className="text-center text-sm tablet:text-base">
              <th className="font-bold px-2">{'Name'}</th>
              <th className="font-bold px-2">{'Version'}</th>
              <th className="font-bold px-2">{'Update'}</th>
              <th className="font-bold px-2">{'Uninstall'}</th>
              <th />
            </tr>
          </thead>
          <tbody className="text-ui-500 my-1 container bg-gray-50">
            {creditDelegation && (
              <tr className="text-sm tablet:text-base rounded-2xl bg-gray-200">
                <td className="py-1 font-semibold text-center">
                  {creditDelegation.id}
                </td>
                <td className="py-1 font-semibold text-center">
                  {creditDelegation.release}
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() =>
                      handleUpdate(creditDelegation.instanceAddress)
                    }
                  >
                    <IconReload />
                  </button>
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() =>
                      handleUninstall(creditDelegation.instanceAddress)
                    }
                  >
                    <IconClose />
                  </button>
                </td>
                <td />
              </tr>
            )}
            {/* ------------------------------------------------------ */}
            {subgovernance && (
              <tr className="text-sm tablet:text-base rounded-2xl bg-gray-100">
                <td className="py-1 font-semibold text-center">
                  {subgovernance.id}
                </td>
                <td className="py-1 font-semibold text-center">
                  {subgovernance.release}
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() => handleUpdate(subgovernance.instanceAddress)}
                  >
                    <IconReload />
                  </button>
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() =>
                      handleUninstall(subgovernance.instanceAddress)
                    }
                  >
                    <IconClose />
                  </button>
                </td>
                <td />
              </tr>
            )}
            {/* ------------------------------------------------------ */}
            {uniswapV3 && (
              <tr className="text-sm tablet:text-base rounded-2xl bg-gray-200">
                <td className="py-1 font-semibold text-center">
                  {uniswapV3.id}
                </td>
                <td className="py-1 font-semibold text-center">
                  {uniswapV3.release}
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() => handleUpdate(uniswapV3.instanceAddress)}
                  >
                    <IconReload />
                  </button>
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() => handleUninstall(uniswapV3.instanceAddress)}
                  >
                    <IconClose />
                  </button>
                </td>
                <td />
              </tr>
            )}
            {/* ------------------------------------------------------ */}
            {vault && (
              <tr className="text-sm tablet:text-base rounded-2xl bg-gray-100">
                <td className="py-1 font-semibold text-center">{vault.id}</td>
                <td className="py-1 font-semibold text-center">
                  {vault.release}
                </td>
                <td className="py-1 font-semibold text-center">
                  <button onClick={() => handleUpdate(vault.instanceAddress)}>
                    <IconReload />
                  </button>
                </td>
                <td className="py-1 font-semibold text-center">
                  <button
                    onClick={() => handleUninstall(vault.instanceAddress)}
                  >
                    <IconClose />
                  </button>
                </td>
                <td />
              </tr>
            )}
            {/* ------------------------------------------------------ */}
            {pwn && (
              <tr className="text-sm tablet:text-base rounded-2xl bg-gray-200">
                <td className="py-1 font-semibold text-center">{pwn.id}</td>
                <td className="py-1 font-semibold text-center">
                  {pwn.release}
                </td>
                <td className="py-1 font-semibold text-center">
                  <button onClick={() => handleUpdate(pwn.instanceAddress)}>
                    <IconReload />
                  </button>
                </td>
                <td className="py-1 font-semibold text-center">
                  <button onClick={() => handleUninstall(pwn.instanceAddress)}>
                    <IconClose />
                  </button>
                </td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
