import ButtonDelete from './ButtonDelete'

const ItemTotalAndDelete = ({ total, onDelete }) => {
  return (
    <div className="flex items-center justify-end gap-2 pr-1">
      <div className="responsive-text-sm font-semibold px-2">
        <span>{total}</span>
        <span className="pl-1 underline">đ</span>
      </div>
      {/* Nút xoá */}
      <ButtonDelete onDelete={onDelete} />
    </div>
  )
}

export default ItemTotalAndDelete
