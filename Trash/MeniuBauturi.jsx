import React, { useState} from 'react';
import Bautura from './Bautura';

function MenuBauturi() {
  const bauturi = [
    { id: 1, nume: 'Espresso', img: '/Espresso.png' },
    { id: 2, nume: 'Cold Brew', img: '/Cold_Brew.png' },
    { id: 3, nume: 'Cinnamon Latte', img: '/Cinnamon_Latte.png' },
    { id: 4, nume: 'Capuchino', img: '/Capuchino.png' },
    { id: 5, nume: 'White Moca', img: '/White_Mocha.png' },
    { id: 6, nume: 'Hazelnut Latte', img: '/Hazelnut_Latte.png' },
  ];

  const filtre = ['All', 'Espresso', 'Cappuccino', 'Latte', 'Mocha'];

  return (
    <div className="container my-4 rounded">
      <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
        {filtre.map((filtru, index) => (
          <button key={index} type="button" className="btn btn-outline-secondary">
            {filtru}
          </button>
        ))}
      </div>

      <div className="row g-3">
        {bauturi.map((bautura) => (
          <div key={bautura.id} className="col-6 col-md-3 d-flex justify-content-center">
            <Bautura nume={bautura.nume} img={bautura.img} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuBauturi;
