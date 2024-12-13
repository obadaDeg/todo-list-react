import React from 'react';
import styles from './InputSkeleton.module.css';

const InputSkeleton = () => {
  return <div className={styles.skeleton}>
    <p>Loading...</p>
  </div>;
};

export default InputSkeleton;
