import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/utils/store' // Import RootState type
import { setActiveTab } from '@/utils/tabSlice'

export const TopBar = () => {
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab)
  const dispatch = useDispatch()

  const tabs = ['Wild Pokemon', 'Pokemon Party', 'PC Box']

  return (
    <header className="top-0 left-0 sticky w-full bg-gray-900">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li key={tab} className="me-2">
              <button
                onClick={() => dispatch(setActiveTab(tab))}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
