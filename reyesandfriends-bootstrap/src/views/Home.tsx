function Home() {
  return (
    <>
      <div className="callout primary">
        <div className="row column">
          <h1>Hello! This is the portfolio of a very witty person.</h1>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla.
          </p>
        </div>
      </div>
      <div className="row small-up-2 medium-up-3 large-up-4">
        {[...Array(2)].map((_, i) => (
          <div className="column" key={i}>
            <img className="thumbnail" src="https://placehold.it/550x550" alt="site" />
            <h5>My Site</h5>
          </div>
        ))}
      </div>
      <hr />
      <div className="row">
        <div className="medium-6 columns">
          <h3>Contact Me</h3>
          <p>
            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor.
          </p>
          <ul className="menu">
            <li><a href="#">Dribbble</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Yo</a></li>
          </ul>
        </div>
        <div className="medium-6 columns">
          <label>
            Name
            <input type="text" placeholder="Name" />
          </label>
          <label>
            Email
            <input type="text" placeholder="Email" />
          </label>
          <label>
            Message
            <textarea placeholder="holla at a designerd"></textarea>
          </label>
          <input type="submit" className="button expanded" value="Submit" />
        </div>
      </div>
    </>
  );
}

export default Home;