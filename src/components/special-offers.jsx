import '../css/special-offers.css'

function SpecialOfferCard({ city, country, price, imgSrc, onDetails }) {
  return (
    <div className='card'>
      <img src={imgSrc} alt={`${city}, ${country}`} className='image'/>
      <div className='info'>
        <h3 className='city'>{city}</h3>
        <p className='price'>Цена от {price}$</p>
        <button className='button-details' onClick={onDetails}>Подробнее</button>
      </div>
    </div>
  );
}

export default SpecialOfferCard;
