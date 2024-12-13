import styles from "./InputSkeleton.module.css";

const InputSkeleton = () => {
  return (
    <>
      <div className={styles.skeletonContainer}>
        <div className={styles.skeleton} />
      </div>
      
    </>
  );
};

export default InputSkeleton;
