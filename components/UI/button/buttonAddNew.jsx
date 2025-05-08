import PlusIcon from "@/components/icons/common/PlusIcon";

const ButtonAddNew = ({ onClick, dataLang, ...rest }) => {
  return (
    <button
      {...rest}
      type="button"
      onClick={() => onClick()}
      className={`${rest?.className} responsive-text-sm xl:px-5 px-3 xl:py-2.5 py-1.5 bg-background-blue-2 text-white rounded-lg btn-animation hover:scale-105 flex items-center gap-x-2`}
    >
      <PlusIcon />
      {dataLang?.btn_new || "btn_new"}
    </button>
  );
};
export default ButtonAddNew;
