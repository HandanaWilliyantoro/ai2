import {RxMagnifyingGlass} from 'react-icons/rx'

const Search = ({onChange, value, onSubmitHandler, onSubmitHandlerKeydown}) => {

  return (
    <div className="relative mt-1 w-full">
        <input onKeyDown={onSubmitHandlerKeydown} onChange={onChange} value={value} type="text" id="password" className="w-full bg-white rounded-full pl-4 pr-10 py-2 border-2 border-black-200 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Search..."/>
        <button onClick={onSubmitHandler} className="block w-7 h-7 border-l-2 pl-1 font-serif text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"><RxMagnifyingGlass onClick={onSubmitHandler} /></button>
    </div>
  )
}

export default Search