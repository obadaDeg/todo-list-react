import React from 'react'
import styles from './Header.module.css'

export default function Header({ title }) {
  return (
    <header>
        <p className={styles.headerTitle}>{title}</p>
    </header>
  )
}
