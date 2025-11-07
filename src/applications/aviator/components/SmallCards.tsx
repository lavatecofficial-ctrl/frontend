'use client';

import { TbUsers, TbCash, TbChartLine, TbBuildingBank } from 'react-icons/tb';
import { MdOutlineAttachMoney, MdDoNotDisturbOnTotalSilence } from 'react-icons/md';
import { HiOutlineCreditCard } from 'react-icons/hi';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { RoundData } from '@/types/portal';
import { memo } from 'react';
import styles from '../styles/SmallCards.module.css';

interface SmallCardsProps {
  roundData: RoundData;
}

const SmallCards = memo(({ roundData }: SmallCardsProps) => {
  return (
    <>
      {/* Card 1 - Jugadores */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <TbUsers className={styles.iconGreen} />
          <span className={styles.kpiLabel}>JUGADORES</span>
        </div>
        <div className={`${styles.kpiValue} ${styles.valueGreen}`}>
          {roundData.online_players.toLocaleString()}
        </div>
      </div>

      {/* Card 2 - Apuestas */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <MdDoNotDisturbOnTotalSilence className={styles.iconBlue} />
          <span className={styles.kpiLabel}>APUESTAS</span>
        </div>
        <div className={`${styles.kpiValue} ${styles.valueBlue}`}>
          {roundData.bets_count.toLocaleString()}
        </div>
      </div>

      {/* Card 3 - Total Apostado */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <HiOutlineCreditCard className={styles.iconYellow} />
          <span className={styles.kpiLabel}>TOTAL APOSTADO</span>
        </div>
        <div className={`${styles.kpiValue} ${styles.valueYellow}`}>
          ${roundData.total_bet_amount.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </div>
      </div>

      {/* Card 4 - Total Cashout */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <LiaCashRegisterSolid className={styles.iconPurple} />
          <span className={styles.kpiLabel}>TOTAL CASHOUT</span>
        </div>
        <div className={`${styles.kpiValue} ${styles.valuePurple}`}>
          ${roundData.total_cashout.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </div>
      </div>

      {/* Card 5 - Ganancia Casino */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <TbBuildingBank className={roundData.casino_profit && roundData.casino_profit > 0 ? styles.iconGreen : styles.iconRed} />
          <span className={styles.kpiLabel}>GANANCIA CASINO</span>
        </div>
        <div className={`${styles.kpiValue} ${roundData.casino_profit && roundData.casino_profit > 0 ? styles.valueGreen : styles.valueRed}`}>
          ${roundData.casino_profit ? roundData.casino_profit.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}
        </div>
      </div>

      {/* Card 6 - Hora */}
      <div className={styles.kpiCardTime}>
        {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </>
  );
});

SmallCards.displayName = 'SmallCards';

export default SmallCards;
