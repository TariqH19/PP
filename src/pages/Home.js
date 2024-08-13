import { Chatbot } from "../components/Chatbot";
// import AddItemForm from "../components/AddItemForm";

const Home = () => {
  return (
    <>
      <div className={`app-container `}>
        <main className="stack">
          {/* <h1 className="heading">What can we help you with today?</h1> */}
          <div className="cluster"></div>
          <Chatbot />
        </main>
        {/* <AddItemForm /> */}
      </div>
    </>
  );
};

export default Home;
