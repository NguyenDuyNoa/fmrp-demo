import { useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const FilterDropdown = ({ children, trigger, className, dropdownId, ...props }) => {
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const dispatch = useDispatch();
    const stateFilterDropdown = useSelector(state => state.stateFilterDropdown)

    const isOpen = stateFilterDropdown?.openDropdownId === dropdownId;

    const toggleDropdown = () => {
        // dispatch({ type: "stateFilterDropdown", payload: { open: !stateFilterDropdown?.open } });
        dispatch({
            type: "stateFilterDropdown",
            payload: { openDropdownId: isOpen ? null : dropdownId }
        });
    }

    const handleClickOutside = (event) => {
        const dropdownElement = dropdownRef.current;
        const triggerElement = triggerRef.current;

        // Kiểm tra click ngoài Dropdown và Trigger chính
        const clickedOutsideDropdown = dropdownElement && !dropdownElement.contains(event.target);
        const clickedOutsideTrigger = triggerElement && !triggerElement.contains(event.target);

        // kiểm tra click vào menu combobox hoặc indicator hoặc vùng multi-select (cả label và nút remove)
        const clickedInsideSelect = event.target.closest('.productionSmoothing__menu, .productionSmoothing__indicator, .productionSmoothing__multi-value, .productionSmoothing__multi-value__remove');

        if (clickedOutsideDropdown && clickedOutsideTrigger && !clickedInsideSelect) {
            dispatch({ type: "stateFilterDropdown", payload: { openDropdownId: null } });
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block">
            {isValidElement(trigger)
                ? cloneElement(trigger, {
                    ref: triggerRef,
                    onClick: toggleDropdown,
                })
                : null
            }

            {
                isOpen && (
                    <div
                        ref={dropdownRef}
                        className={`${className} absolute right-0 mt-2 bg-white shadow-lg rounded-lg border z-50 min-w-[600px] p-4`}
                        {...props}
                    >
                        {children}
                    </div>
                )
            }
        </div>
    );
};

export default FilterDropdown;
