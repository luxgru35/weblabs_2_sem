//Home.tsx
import styles from "./Home.module.scss";
import HomeComponent from "./components/HomeComponent";

const Home = () => {
  return (
    <div className={styles.homePage}>
      <h1>Welcome to the Home Page</h1>
      <HomeComponent />
    </div>
  );
};

export default Home;
