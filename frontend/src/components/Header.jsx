import React from 'react';

function Header(){
    return(
            <header className="d-flex bg-dark text-white p-2 justify-content-between py-2 align-items-center    ">
                <div className="d-flex align-items-center gap-5    ">
                    <h6>VintHUB Caffes</h6>
                </div>

                <div className="position-absolute d-flex start-50 translate-middle-x">
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Search"/>
                    </div>
                </div>

            </header>
    );
}

export default Header;