import Link from 'next/link';
import React from 'react';

const Breadcrumb = ({ items, className }) => (
    <React.Fragment>
        <div className={`flex space-x-1 mt-3 ${className || ''}`}>
            {
                items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-1">
                        {
                            item.link ?
                                (
                                    <Link href={item.link}>
                                        <h6 className="text-[#141522]/40 cursor-pointer hover:text-[#141522] transition">{item.label}</h6>
                                    </Link>
                                )
                                :
                                (
                                    <h6 className={`${index !== items.length - 1 ? 'text-[#141522]/40' : ''}`}>{item.label}</h6>
                                )
                        }
                        {index < items.length - 1 && <span className="text-[#141522]/40">/</span>}
                    </div>
                ))
            }

        </div>
    </React.Fragment>
);

export default Breadcrumb;
