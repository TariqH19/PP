const Resources = () => {
  return (
    <div className={`app-container`}>
      <div className="header">
        <h2 className="heading">For help in an Emergency</h2>
      </div>
      <div className="content">
        <div className="card">
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            National Emergency
          </h3>
          <p className="card-text">
            Irish national emergency number. Stay calm, stay focused and stay on
            the line.
          </p>
          <p>
            <strong>Call:</strong> 991
          </p>
          <p>
            <strong>Call:</strong> 112
          </p>
        </div>
        <div className="card">
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            First Aid on campus
          </h3>
          <p className="card-text">
            If student health is not available, call caretakers desk for
            first-aid.
          </p>
          <p>
            <strong>Call:</strong> 01-2394999
          </p>
        </div>
        <div className="card">
          <h2 className="card-title text-xl">First Aid + Health</h2>
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            College Nurse
          </h3>
          <p className="card-text">
            Medical help on campus. 9am-5pm Monday to Friday
          </p>
          <p>
            <strong>Call:</strong> 01-2394760
          </p>
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            E-doc Support
          </h3>
          <p className="card-text">
            Out of hours GP Service, for urgent GP care running from 6pm to 8am
            Monday to Friday and 24 Hours Saturday, Sunday and all public
            holidays.
          </p>
          <p>
            <strong>Call:</strong> +353 1 2234500
          </p>
        </div>
        <div className="card">
          <h2 className="card-title text-xl">Emergency Counselling</h2>
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            Crisis Text Line
          </h3>
          <p className="card-text">
            Free 24/7 anonymous text support in a crisis. Chat with a trained
            volunteer at any time. If your life is in danger, call 999.
          </p>
          <p>
            <strong>Text:</strong> MU to 50808
          </p>
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            Samaritans
          </h3>
          <p className="card-text">Available 24/7 for free support</p>
          <p>
            <strong>Call:</strong> 116 123
          </p>
          <p>
            <strong>Email:</strong> jo@samaritans.ie
          </p>
          <h3 className="card-title text-regal-pink dark:text-regal-blue">
            Aware
          </h3>
          <p className="card-text">
            Depression support. Free service available to anyone aged 18 and
            over, who is seeking support and information. (7 days a week 10AM -
            10 PM).
          </p>
          <p>
            <strong>Call:</strong> 1800 804 848
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
