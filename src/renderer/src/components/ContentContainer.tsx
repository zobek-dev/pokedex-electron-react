import { useSelector } from 'react-redux'
import { RootState } from '@/utils/store'
import { WildPokemonContainer, PartyContainer, PcBoxContainer } from '@/components'

export const ContentContainer = () => {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab)
  return (
    <div className="flex flex-row justify-center items-center h-full text-gray-400">
      {activeTab === 'Wild Pokemon' && <WildPokemonContainer />}
      {activeTab === 'Pokemon Party' && <PartyContainer />}
      {activeTab === 'PC Box' && <PcBoxContainer />}
    </div>
  )
}
