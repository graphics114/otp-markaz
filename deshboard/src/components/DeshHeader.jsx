import { useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import { toggleNavbar } from "../store/slices/extraSlice";

const Header = () => {

    const dispatch = useDispatch();

    return(<>
    <header className="flex justify-end mb-2 pb-1">

        <div className="flex gap-3 items-center">
            <Menu className="block md:hidden" onClick={()=> dispatch(toggleNavbar())} />
        </div>
    </header>
    </>);
};

export default Header;