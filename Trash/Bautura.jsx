import React from 'react';

function Bautura({ nume, img }) {
    const dimensiuneBautura = ['Mica', 'Medie', 'Mare'];

  return (
    <div className="border border-secondary rounded p-2 d-flex flex-column align-items-center">
      <img
        src={img}
        alt={nume}
        className="img-fluid rounded mb-2"
        style={{ width: '200px', height: '100px', objectFit: 'cover' }}
      />
      <h5 className="text-center">{nume}</h5>
        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
            {dimensiuneBautura.map((dimensiune, index) => (
            <button key={index} type="button" className="btn btn-outline-secondary btn-sm mt-5">
                {dimensiune}
            </button>
            ))}
        </div>
    </div>
  );
}

export default Bautura;
