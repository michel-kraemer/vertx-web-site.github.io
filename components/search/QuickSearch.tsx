import { useIsApple } from "../hooks/useIsApple"
import { MagnifyingGlass } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false })

interface QuickSearchProps {
  onClick?: () => void
}

const QuickSearch = ({ onClick }: QuickSearchProps) => {
  const isApple = useIsApple()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  useHotkeys(
    "mod+k",
    () => {
      setSearchDialogOpen(true)
    },
    {
      preventDefault: true,
    },
  )

  return (
    <>
      <button
        className="xl:hidden"
        onClick={() => {
          onClick?.()
          setSearchDialogOpen(true)
        }}
        aria-label="Search docs ..."
      >
        <MagnifyingGlass size="1.75rem" />
      </button>
      <button
        className="hidden h-8 w-48 cursor-pointer select-none items-center justify-between rounded border border-gray-300 bg-bg pl-3 pr-2 text-sm text-gray-600 transition-colors hover:border-gray-500 focus:[outline-style:none] focus-visible:outline-2 focus-visible:[outline-style:solid] xl:flex 2xl:w-56"
        onClick={e => {
          if (e.screenX > 0) {
            // User used the mouse to click the button. Remove focus so it won't
            // be focused after we've closed the dialog.
            e.currentTarget.blur()
          }
          setSearchDialogOpen(true)
        }}
      >
        Search docs ...
        {isApple !== undefined ? (
          <div className="flex h-5 items-center rounded border border-gray-300 px-1 text-xs text-gray-600">
            {isApple ? "⌘" : "Ctrl+"}K
          </div>
        ) : undefined}
      </button>
      <SearchDialog
        open={searchDialogOpen}
        onClose={() => {
          onClick?.()
          setSearchDialogOpen(false)
        }}
      />
    </>
  )
}

export default QuickSearch
