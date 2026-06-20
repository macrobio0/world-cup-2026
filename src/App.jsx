import React, { useState, useMemo } from 'react';
import { Trophy, MapPin, Calendar, RotateCcw, Info, ListChecks, Table2, Network } from 'lucide-react';

// ===================== DATA: GROUPS =====================
const GROUPS = {
  A: ['Mexico', 'South Korea', 'South Africa', 'Czechia'],
  B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Scotland', 'Haiti'],
  D: ['USA', 'Paraguay', 'Australia', 'Türkiye'],
  E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Congo DR', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

const GROUP_LETTERS = Object.keys(GROUPS);

// ===================== REAL GROUP STAGE FIXTURES (from official FIFA schedule PDF) =====================
// preResult: [scoreA, scoreB] if already played per the PDF, else null
const GROUP_MATCHES = [
  // Jueves 11 junio
  { id: 'A1', group: 'A', matchday: 1, teamA: 'Mexico', teamB: 'South Africa', venue: 'Estadio Ciudad de México', city: 'Ciudad de México', date: '2026-06-11', timeET: null, timeCDMX: null, preResult: [2, 0] },
  { id: 'A2', group: 'A', matchday: 1, teamA: 'South Korea', teamB: 'Czechia', venue: 'Estadio Guadalajara', city: 'Guadalajara', date: '2026-06-11', timeET: null, timeCDMX: null, preResult: [2, 1] },
  // Viernes 12 junio
  { id: 'B1', group: 'B', matchday: 1, teamA: 'Canada', teamB: 'Bosnia & Herzegovina', venue: 'Toronto Stadium', city: 'Toronto', date: '2026-06-12', timeET: null, timeCDMX: null, preResult: [1, 1] },
  { id: 'D1', group: 'D', matchday: 1, teamA: 'USA', teamB: 'Paraguay', venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-12', timeET: null, timeCDMX: null, preResult: [4, 1] },
  // Sábado 13 junio
  { id: 'B2', group: 'B', matchday: 1, teamA: 'Qatar', teamB: 'Switzerland', venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-06-13', timeET: null, timeCDMX: null, preResult: [1, 1] },
  { id: 'C1', group: 'C', matchday: 1, teamA: 'Brazil', teamB: 'Morocco', venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-13', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: [1, 1] },
  { id: 'C2', group: 'C', matchday: 1, teamA: 'Haiti', teamB: 'Scotland', venue: 'Boston Stadium', city: 'Boston', date: '2026-06-13', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '21:00 ET', preResult: [0, 1] },
  { id: 'D2', group: 'D', matchday: 1, teamA: 'Australia', teamB: 'Türkiye', venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-06-13', timeET: '00:00', timeKansas: '23:00', timeCDMX: '22:00', timeLocal: '21:00 PT', preResult: [2, 0] },
  // Domingo 14 junio
  { id: 'E1', group: 'E', matchday: 1, teamA: 'Germany', teamB: 'Curaçao', venue: 'Houston Stadium', city: 'Houston', date: '2026-06-14', timeET: '13:00', timeKansas: '12:00', timeCDMX: '11:00', timeLocal: '12:00 CT', preResult: [7, 1] },
  { id: 'F1', group: 'F', matchday: 1, teamA: 'Netherlands', teamB: 'Japan', venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-14', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '15:00 CT', preResult: [2, 2] },
  { id: 'E2', group: 'E', matchday: 1, teamA: 'Ivory Coast', teamB: 'Ecuador', venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-06-14', timeET: '19:00', timeKansas: '18:00', timeCDMX: '17:00', timeLocal: '19:00 ET', preResult: [1, 0] },
  { id: 'F2', group: 'F', matchday: 1, teamA: 'Sweden', teamB: 'Tunisia', venue: 'Estadio Monterrey', city: 'Monterrey', date: '2026-06-14', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '20:00 CST', preResult: [5, 1] },
  // Lunes 15 junio
  { id: 'H1', group: 'H', matchday: 1, teamA: 'Spain', teamB: 'Cape Verde', venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-06-15', timeET: '12:00', timeKansas: '11:00', timeCDMX: '10:00', timeLocal: '12:00 ET', preResult: [0, 0] },
  { id: 'G1', group: 'G', matchday: 1, teamA: 'Belgium', teamB: 'Egypt', venue: 'Seattle Stadium', city: 'Seattle', date: '2026-06-15', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: [1, 1] },
  { id: 'H2', group: 'H', matchday: 1, teamA: 'Saudi Arabia', teamB: 'Uruguay', venue: 'Miami Stadium', city: 'Miami', date: '2026-06-15', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: [1, 1] },
  { id: 'G2', group: 'G', matchday: 1, teamA: 'Iran', teamB: 'New Zealand', venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-15', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '18:00 PT', preResult: [2, 2] },
  // Martes 16 junio
  { id: 'I1', group: 'I', matchday: 1, teamA: 'France', teamB: 'Senegal', venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-16', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '15:00 ET', preResult: [3, 1] },
  { id: 'I2', group: 'I', matchday: 1, teamA: 'Iraq', teamB: 'Norway', venue: 'Boston Stadium', city: 'Boston', date: '2026-06-16', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: [1, 4] },
  { id: 'J1', group: 'J', matchday: 1, teamA: 'Argentina', teamB: 'Algeria', venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-06-16', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '20:00 CT', preResult: [3, 0] },
  { id: 'J2', group: 'J', matchday: 1, teamA: 'Austria', teamB: 'Jordan', venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-06-16', timeET: '00:00', timeKansas: '23:00', timeCDMX: '22:00', timeLocal: '21:00 PT', preResult: [3, 1] },
  // Miércoles 17 junio
  { id: 'K1', group: 'K', matchday: 1, teamA: 'Portugal', teamB: 'Congo DR', venue: 'Houston Stadium', city: 'Houston', date: '2026-06-17', timeET: '13:00', timeKansas: '12:00', timeCDMX: '11:00', timeLocal: '12:00 CT', preResult: [1, 1] },
  { id: 'L1', group: 'L', matchday: 1, teamA: 'England', teamB: 'Croatia', venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-17', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '15:00 CT', preResult: [4, 2] },
  { id: 'L2', group: 'L', matchday: 1, teamA: 'Ghana', teamB: 'Panama', venue: 'Toronto Stadium', city: 'Toronto', date: '2026-06-17', timeET: '19:00', timeKansas: '18:00', timeCDMX: '17:00', timeLocal: '18:00 CT', preResult: [1, 0] },
  { id: 'K2', group: 'K', matchday: 1, teamA: 'Uzbekistan', teamB: 'Colombia', venue: 'Estadio Ciudad de México', city: 'Ciudad de México', date: '2026-06-17', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '20:00 CST', preResult: [1, 3] },
  // Jueves 18 junio
  { id: 'A3', group: 'A', matchday: 2, teamA: 'Czechia', teamB: 'South Africa', venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-06-18', timeET: '12:00', timeKansas: '11:00', timeCDMX: '10:00', timeLocal: '12:00 ET', preResult: [1, 1] },
  { id: 'B3', group: 'B', matchday: 2, teamA: 'Switzerland', teamB: 'Bosnia & Herzegovina', venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-18', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: [4, 1] },
  { id: 'B4', group: 'B', matchday: 2, teamA: 'Canada', teamB: 'Qatar', venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-06-18', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '15:00 PT', preResult: [6, 0] },
  { id: 'A4', group: 'A', matchday: 2, teamA: 'Mexico', teamB: 'South Korea', venue: 'Estadio Guadalajara', city: 'Guadalajara', date: '2026-06-18', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '19:00 CST', preResult: [1, 0] },
  // Viernes 19 junio
  { id: 'D3', group: 'D', matchday: 2, teamA: 'USA', teamB: 'Australia', venue: 'Seattle Stadium', city: 'Seattle', date: '2026-06-19', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: [2, 0] },
  { id: 'C3', group: 'C', matchday: 2, teamA: 'Scotland', teamB: 'Morocco', venue: 'Boston Stadium', city: 'Boston', date: '2026-06-19', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: [0, 1] },
  { id: 'C4', group: 'C', matchday: 2, teamA: 'Brazil', teamB: 'Haiti', venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-06-19', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '21:00 ET', preResult: [3, 0] },
  { id: 'D4', group: 'D', matchday: 2, teamA: 'Türkiye', teamB: 'Paraguay', venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-06-19', timeET: '00:00', timeKansas: '23:00', timeCDMX: '22:00', timeLocal: '21:00 PT', preResult: [0, 1] },
  // Sábado 20 junio
  { id: 'F3', group: 'F', matchday: 2, teamA: 'Netherlands', teamB: 'Sweden', venue: 'Houston Stadium', city: 'Houston', date: '2026-06-20', timeET: '13:00', timeKansas: '12:00', timeCDMX: '11:00', timeLocal: '12:00 CT', preResult: null },
  { id: 'E3', group: 'E', matchday: 2, teamA: 'Germany', teamB: 'Ivory Coast', venue: 'Toronto Stadium', city: 'Toronto', date: '2026-06-20', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '15:00 CT', preResult: null },
  { id: 'E4', group: 'E', matchday: 2, teamA: 'Ecuador', teamB: 'Curaçao', venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-06-20', timeET: '20:00', timeKansas: '19:00', timeCDMX: '18:00', timeLocal: '19:00 CT', preResult: null },
  { id: 'F4', group: 'F', matchday: 2, teamA: 'Tunisia', teamB: 'Japan', venue: 'Estadio Monterrey', city: 'Monterrey', date: '2026-06-20', timeET: '00:00', timeKansas: '23:00', timeCDMX: '22:00', timeLocal: '22:00 CST', preResult: null },
  // Domingo 21 junio
  { id: 'H3', group: 'H', matchday: 2, teamA: 'Spain', teamB: 'Saudi Arabia', venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-06-21', timeET: '12:00', timeKansas: '11:00', timeCDMX: '10:00', timeLocal: '12:00 ET', preResult: null },
  { id: 'G3', group: 'G', matchday: 2, teamA: 'Belgium', teamB: 'Iran', venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-21', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: null },
  { id: 'H4', group: 'H', matchday: 2, teamA: 'Uruguay', teamB: 'Cape Verde', venue: 'Miami Stadium', city: 'Miami', date: '2026-06-21', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: null },
  { id: 'G4', group: 'G', matchday: 2, teamA: 'New Zealand', teamB: 'Egypt', venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-06-21', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '18:00 PT', preResult: null },
  // Lunes 22 junio
  { id: 'J3', group: 'J', matchday: 2, teamA: 'Argentina', teamB: 'Austria', venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-22', timeET: '13:00', timeKansas: '12:00', timeCDMX: '11:00', timeLocal: '12:00 CT', preResult: null },
  { id: 'I3', group: 'I', matchday: 2, teamA: 'France', teamB: 'Iraq', venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-06-22', timeET: '17:00', timeKansas: '16:00', timeCDMX: '15:00', timeLocal: '17:00 ET', preResult: null },
  { id: 'I4', group: 'I', matchday: 2, teamA: 'Norway', teamB: 'Senegal', venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-22', timeET: '20:00', timeKansas: '19:00', timeCDMX: '18:00', timeLocal: '20:00 ET', preResult: null },
  { id: 'J4', group: 'J', matchday: 2, teamA: 'Jordan', teamB: 'Algeria', venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-06-22', timeET: '23:00', timeKansas: '22:00', timeCDMX: '21:00', timeLocal: '20:00 PT', preResult: null },
  // Martes 23 junio
  { id: 'K3', group: 'K', matchday: 2, teamA: 'Portugal', teamB: 'Uzbekistan', venue: 'Houston Stadium', city: 'Houston', date: '2026-06-23', timeET: '13:00', timeKansas: '12:00', timeCDMX: '11:00', timeLocal: '12:00 CT', preResult: null },
  { id: 'L3', group: 'L', matchday: 2, teamA: 'England', teamB: 'Ghana', venue: 'Boston Stadium', city: 'Boston', date: '2026-06-23', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '16:00 ET', preResult: null },
  { id: 'L4', group: 'L', matchday: 2, teamA: 'Panama', teamB: 'Croatia', venue: 'Toronto Stadium', city: 'Toronto', date: '2026-06-23', timeET: '19:00', timeKansas: '18:00', timeCDMX: '17:00', timeLocal: '18:00 CT', preResult: null },
  { id: 'K4', group: 'K', matchday: 2, teamA: 'Colombia', teamB: 'Congo DR', venue: 'Estadio Guadalajara', city: 'Guadalajara', date: '2026-06-23', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '20:00 CST', preResult: null },
  // Miércoles 24 junio
  { id: 'B5', group: 'B', matchday: 3, teamA: 'Switzerland', teamB: 'Canada', venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-06-24', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: null },
  { id: 'B6', group: 'B', matchday: 3, teamA: 'Bosnia & Herzegovina', teamB: 'Qatar', venue: 'Seattle Stadium', city: 'Seattle', date: '2026-06-24', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '12:00 PT', preResult: null },
  { id: 'C5', group: 'C', matchday: 3, teamA: 'Scotland', teamB: 'Brazil', venue: 'Miami Stadium', city: 'Miami', date: '2026-06-24', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: null },
  { id: 'C6', group: 'C', matchday: 3, teamA: 'Morocco', teamB: 'Haiti', venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-06-24', timeET: '18:00', timeKansas: '17:00', timeCDMX: '16:00', timeLocal: '18:00 ET', preResult: null },
  { id: 'A5', group: 'A', matchday: 3, teamA: 'Czechia', teamB: 'Mexico', venue: 'Estadio Ciudad de México', city: 'Ciudad de México', date: '2026-06-24', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '19:00 CST', preResult: null },
  { id: 'A6', group: 'A', matchday: 3, teamA: 'South Africa', teamB: 'South Korea', venue: 'Estadio Monterrey', city: 'Monterrey', date: '2026-06-24', timeET: '21:00', timeKansas: '20:00', timeCDMX: '19:00', timeLocal: '19:00 CST', preResult: null },
  // Jueves 25 junio
  { id: 'E5', group: 'E', matchday: 3, teamA: 'Curaçao', teamB: 'Ivory Coast', venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-06-25', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '16:00 ET', preResult: null },
  { id: 'E6', group: 'E', matchday: 3, teamA: 'Ecuador', teamB: 'Germany', venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-25', timeET: '16:00', timeKansas: '15:00', timeCDMX: '14:00', timeLocal: '16:00 ET', preResult: null },
  { id: 'F5', group: 'F', matchday: 3, teamA: 'Japan', teamB: 'Sweden', venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-25', timeET: '19:00', timeKansas: '18:00', timeCDMX: '17:00', timeLocal: '18:00 CT', preResult: null },
  { id: 'F6', group: 'F', matchday: 3, teamA: 'Tunisia', teamB: 'Netherlands', venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-06-25', timeET: '19:00', timeKansas: '18:00', timeCDMX: '17:00', timeLocal: '18:00 CT', preResult: null },
  { id: 'D5', group: 'D', matchday: 3, teamA: 'Türkiye', teamB: 'USA', venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-25', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '19:00 PT', preResult: null },
  { id: 'D6', group: 'D', matchday: 3, teamA: 'Paraguay', teamB: 'Australia', venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-06-25', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '19:00 PT', preResult: null },
  // Viernes 26 junio
  { id: 'I5', group: 'I', matchday: 3, teamA: 'Norway', teamB: 'France', venue: 'Boston Stadium', city: 'Boston', date: '2026-06-26', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '15:00 ET', preResult: null },
  { id: 'I6', group: 'I', matchday: 3, teamA: 'Senegal', teamB: 'Iraq', venue: 'Toronto Stadium', city: 'Toronto', date: '2026-06-26', timeET: '15:00', timeKansas: '14:00', timeCDMX: '13:00', timeLocal: '14:00 CT', preResult: null },
  { id: 'H5', group: 'H', matchday: 3, teamA: 'Cape Verde', teamB: 'Saudi Arabia', venue: 'Houston Stadium', city: 'Houston', date: '2026-06-26', timeET: '20:00', timeKansas: '19:00', timeCDMX: '18:00', timeLocal: '19:00 CT', preResult: null },
  { id: 'H6', group: 'H', matchday: 3, teamA: 'Uruguay', teamB: 'Spain', venue: 'Estadio Guadalajara', city: 'Guadalajara', date: '2026-06-26', timeET: '20:00', timeKansas: '19:00', timeCDMX: '18:00', timeLocal: '18:00 CST', preResult: null },
  { id: 'G5', group: 'G', matchday: 3, teamA: 'Egypt', teamB: 'Iran', venue: 'Seattle Stadium', city: 'Seattle', date: '2026-06-26', timeET: '23:00', timeKansas: '22:00', timeCDMX: '21:00', timeLocal: '20:00 PT', preResult: null },
  { id: 'G6', group: 'G', matchday: 3, teamA: 'New Zealand', teamB: 'Belgium', venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-06-26', timeET: '23:00', timeKansas: '22:00', timeCDMX: '21:00', timeLocal: '20:00 PT', preResult: null },
  // Sábado 27 junio
  { id: 'L5', group: 'L', matchday: 3, teamA: 'Panama', teamB: 'England', venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-27', timeET: '17:00', timeKansas: '16:00', timeCDMX: '15:00', timeLocal: '17:00 ET', preResult: null },
  { id: 'L6', group: 'L', matchday: 3, teamA: 'Croatia', teamB: 'Ghana', venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-06-27', timeET: '17:00', timeKansas: '16:00', timeCDMX: '15:00', timeLocal: '17:00 ET', preResult: null },
  { id: 'K5', group: 'K', matchday: 3, teamA: 'Colombia', teamB: 'Portugal', venue: 'Miami Stadium', city: 'Miami', date: '2026-06-27', timeET: '19:30', timeKansas: '18:30', timeCDMX: '17:30', timeLocal: '19:30 ET', preResult: null },
  { id: 'K6', group: 'K', matchday: 3, teamA: 'Congo DR', teamB: 'Uzbekistan', venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-06-27', timeET: '19:30', timeKansas: '18:30', timeCDMX: '17:30', timeLocal: '19:30 ET', preResult: null },
  { id: 'J5', group: 'J', matchday: 3, teamA: 'Algeria', teamB: 'Austria', venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-06-27', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '21:00 CT', preResult: null },
  { id: 'J6', group: 'J', matchday: 3, teamA: 'Jordan', teamB: 'Argentina', venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-27', timeET: '22:00', timeKansas: '21:00', timeCDMX: '20:00', timeLocal: '21:00 CT', preResult: null },
];

// ===================== KNOCKOUT FIXED PAIRINGS (Round of 32) - from official PDF =====================
const R32_TEMPLATE = [
  { match: 73, a: { type: 'pos', group: 'A', pos: 2 }, b: { type: 'pos', group: 'B', pos: 2 }, venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-06-28' },
  { match: 74, a: { type: 'pos', group: 'E', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de A/B/C/D/F' }, venue: 'Boston Stadium', city: 'Boston', date: '2026-06-29' },
  { match: 75, a: { type: 'pos', group: 'F', pos: 1 }, b: { type: 'pos', group: 'C', pos: 2 }, venue: 'Estadio Monterrey', city: 'Monterrey', date: '2026-06-29' },
  { match: 76, a: { type: 'pos', group: 'C', pos: 1 }, b: { type: 'pos', group: 'F', pos: 2 }, venue: 'Houston Stadium', city: 'Houston', date: '2026-06-29' },
  { match: 77, a: { type: 'pos', group: 'I', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de C/D/F/G/H' }, venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-06-30' },
  { match: 78, a: { type: 'pos', group: 'E', pos: 2 }, b: { type: 'pos', group: 'I', pos: 2 }, venue: 'Dallas Stadium', city: 'Dallas', date: '2026-06-30' },
  { match: 79, a: { type: 'pos', group: 'A', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de C/E/F/H/I' }, venue: 'Estadio Ciudad de México', city: 'Ciudad de México', date: '2026-06-30' },
  { match: 80, a: { type: 'pos', group: 'L', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de E/H/I/J/K' }, venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-07-01' },
  { match: 81, a: { type: 'pos', group: 'D', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de B/E/F/I/J' }, venue: 'San Francisco Bay Area Stadium', city: 'San Francisco Bay Area', date: '2026-07-01' },
  { match: 82, a: { type: 'pos', group: 'G', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de A/E/H/I/J' }, venue: 'Seattle Stadium', city: 'Seattle', date: '2026-07-01' },
  { match: 83, a: { type: 'pos', group: 'K', pos: 2 }, b: { type: 'pos', group: 'L', pos: 2 }, venue: 'Toronto Stadium', city: 'Toronto', date: '2026-07-02' },
  { match: 84, a: { type: 'pos', group: 'H', pos: 1 }, b: { type: 'pos', group: 'J', pos: 2 }, venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-07-02' },
  { match: 85, a: { type: 'pos', group: 'B', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de E/F/G/I/J' }, venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-07-02' },
  { match: 86, a: { type: 'pos', group: 'J', pos: 1 }, b: { type: 'pos', group: 'H', pos: 2 }, venue: 'Miami Stadium', city: 'Miami', date: '2026-07-03' },
  { match: 87, a: { type: 'pos', group: 'K', pos: 1 }, b: { type: '3rd', label: 'Mejor 3° de D/E/I/J/L' }, venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-07-03' },
  { match: 88, a: { type: 'pos', group: 'D', pos: 2 }, b: { type: 'pos', group: 'G', pos: 2 }, venue: 'Dallas Stadium', city: 'Dallas', date: '2026-07-03' },
];

const R16_TEMPLATE = [
  { match: 89, a: 74, b: 77, venue: 'Philadelphia Stadium', city: 'Philadelphia', date: '2026-07-04' },
  { match: 90, a: 73, b: 75, venue: 'Houston Stadium', city: 'Houston', date: '2026-07-04' },
  { match: 91, a: 76, b: 78, venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-07-05' },
  { match: 92, a: 79, b: 80, venue: 'Estadio Ciudad de México', city: 'Ciudad de México', date: '2026-07-05' },
  { match: 93, a: 83, b: 84, venue: 'Dallas Stadium', city: 'Dallas', date: '2026-07-06' },
  { match: 94, a: 81, b: 82, venue: 'Seattle Stadium', city: 'Seattle', date: '2026-07-06' },
  { match: 95, a: 86, b: 88, venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-07-07' },
  { match: 96, a: 85, b: 87, venue: 'BC Place Vancouver', city: 'Vancouver', date: '2026-07-07' },
];

const QF_TEMPLATE = [
  { match: 97, a: 89, b: 90, venue: 'Boston Stadium', city: 'Boston', date: '2026-07-09' },
  { match: 98, a: 93, b: 94, venue: 'Los Angeles Stadium', city: 'Los Angeles', date: '2026-07-10' },
  { match: 99, a: 91, b: 92, venue: 'Miami Stadium', city: 'Miami', date: '2026-07-11' },
  { match: 100, a: 95, b: 96, venue: 'Kansas City Stadium', city: 'Kansas City', date: '2026-07-11' },
];

const SF_TEMPLATE = [
  { match: 101, a: 97, b: 98, venue: 'Dallas Stadium', city: 'Dallas', date: '2026-07-14' },
  { match: 102, a: 99, b: 100, venue: 'Atlanta Stadium', city: 'Atlanta', date: '2026-07-15' },
];

const THIRD_PLACE = { match: 103, a: 101, b: 102, venue: 'Miami Stadium', city: 'Miami', date: '2026-07-18', label: 'Tercer lugar' };
const FINAL = { match: 104, a: 101, b: 102, venue: 'New York New Jersey Stadium', city: 'New York/New Jersey', date: '2026-07-19', label: 'Final' };

const ROUND_LABELS = {
  r32: 'Ronda de 32',
  r16: 'Octavos de Final',
  qf: 'Cuartos de Final',
  sf: 'Semifinales',
  f: 'Final / Tercer Lugar',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ===================== STANDINGS CALCULATION =====================
function computeStandings(groupResults) {
  const standings = {};
  GROUP_LETTERS.forEach((group) => {
    const table = {};
    GROUPS[group].forEach((team) => {
      table[team] = { team, pts: 0, played: 0, gf: 0, ga: 0, gd: 0, w: 0, d: 0, l: 0 };
    });
    GROUP_MATCHES.filter((m) => m.group === group).forEach((m) => {
      const r = groupResults[m.id];
      if (!r || r.scoreA === '' || r.scoreB === '' || r.scoreA === undefined || r.scoreB === undefined) return;
      const sa = parseInt(r.scoreA);
      const sb = parseInt(r.scoreB);
      if (isNaN(sa) || isNaN(sb)) return;

      const A = table[m.teamA];
      const B = table[m.teamB];
      A.played++; B.played++;
      A.gf += sa; A.ga += sb;
      B.gf += sb; B.ga += sa;
      if (sa > sb) { A.pts += 3; A.w++; B.l++; }
      else if (sb > sa) { B.pts += 3; B.w++; A.l++; }
      else { A.pts += 1; B.pts += 1; A.d++; B.d++; }
    });
    Object.values(table).forEach((t) => { t.gd = t.gf - t.ga; });
    standings[group] = Object.values(table).sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (y.gd !== x.gd) return y.gd - x.gd;
      if (y.gf !== x.gf) return y.gf - x.gf;
      return x.team.localeCompare(y.team);
    });
  });
  return standings;
}

// Build official results from preResult data (this is the "source of truth" you update)
function buildOfficialResults() {
  const official = {};
  GROUP_MATCHES.forEach((m) => {
    if (m.preResult) {
      official[m.id] = { scoreA: String(m.preResult[0]), scoreB: String(m.preResult[1]) };
    }
  });
  return official;
}

// localStorage helpers
const STORAGE_KEYS = {
  groupSim: 'wc26_group_sim',
  thirdPlace: 'wc26_third_place',
  koResults: 'wc26_ko_results',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (e.g. private browsing)
  }
}

// ===================== MAIN COMPONENT =====================
export default function App() {
  const [view, setView] = useState('matches'); // matches | table | bracket

  // Official results: hardcoded preResult data, updated by the app maintainer via code edits + git push
  const officialResults = useMemo(() => buildOfficialResults(), []);

  // User's own simulated results for matches without an official result yet (persisted per-browser)
  const [simResults, setSimResults] = useState(() => loadFromStorage(STORAGE_KEYS.groupSim, {}));
  const [thirdPlaceQualifiers, setThirdPlaceQualifiers] = useState(() => loadFromStorage(STORAGE_KEYS.thirdPlace, {}));
  const [koResults, setKoResults] = useState(() => loadFromStorage(STORAGE_KEYS.koResults, {}));

  // Combined: official results take priority; user sim fills in the rest
  const groupResults = useMemo(() => ({ ...simResults, ...officialResults }), [simResults, officialResults]);

  const standings = useMemo(() => computeStandings(groupResults), [groupResults]);

  function setGroupScore(matchId, side, value) {
    // Don't allow editing matches that already have an official result
    if (officialResults[matchId]) return;
    setSimResults((prev) => {
      const next = { ...prev, [matchId]: { ...(prev[matchId] || {}), [side]: value } };
      saveToStorage(STORAGE_KEYS.groupSim, next);
      return next;
    });
  }

  function getGroupPos(group, pos) {
    return standings[group]?.[pos - 1]?.team || `${pos}° Grupo ${group}`;
  }

  const allThirdPlaceTeams = useMemo(() => {
    return GROUP_LETTERS.map((g) => {
      const t = standings[g]?.[2];
      return { team: t?.team, group: g, pts: t?.pts || 0, gd: t?.gd || 0, gf: t?.gf || 0 };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }, [standings]);

  const top8ThirdPlace = allThirdPlaceTeams.slice(0, 8);

  function getKoWinner(matchNum) {
    return koResults[matchNum]?.winner || null;
  }

  function setKoScore(matchNum, teamA, teamB, scoreA, scoreB) {
    setKoResults((prev) => {
      let winner = null;
      if (scoreA !== '' && scoreB !== '' && scoreA !== undefined && scoreB !== undefined) {
        const sa = parseInt(scoreA);
        const sb = parseInt(scoreB);
        if (!isNaN(sa) && !isNaN(sb)) {
          if (sa > sb) winner = teamA;
          else if (sb > sa) winner = teamB;
          else winner = prev[matchNum]?.penWinner || null;
        }
      }
      const next = { ...prev, [matchNum]: { ...(prev[matchNum] || {}), teamA, teamB, scoreA, scoreB, winner } };
      saveToStorage(STORAGE_KEYS.koResults, next);
      return next;
    });
  }

  function setKoPenalty(matchNum, teamA, teamB, team) {
    setKoResults((prev) => {
      const next = { ...prev, [matchNum]: { ...(prev[matchNum] || {}), teamA, teamB, penWinner: team, winner: team } };
      saveToStorage(STORAGE_KEYS.koResults, next);
      return next;
    });
  }

  function setThirdPlaceQualifiersPersist(updater) {
    setThirdPlaceQualifiers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.thirdPlace, next);
      return next;
    });
  }

  function resetSimulation() {
    if (!window.confirm('¿Borrar tu simulación personal? Los resultados oficiales no se verán afectados.')) return;
    setSimResults({});
    setThirdPlaceQualifiers({});
    setKoResults({});
    saveToStorage(STORAGE_KEYS.groupSim, {});
    saveToStorage(STORAGE_KEYS.thirdPlace, {});
    saveToStorage(STORAGE_KEYS.koResults, {});
  }

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1a1a1a]">
      <div className="border-b border-[#D9D9D6] bg-[#006847] sticky top-0 z-50" style={{ backgroundColor: '#006847' }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="text-[#CE1126]" size={28} />
              <div>
                <h1 className="display text-2xl text-[#CE1126]">Mundial 2026 — Simulador</h1>
                <p className="text-xs text-[#E8F5EE]">Captura resultados y mira el efecto en tablas y bracket</p>
              </div>
            </div>
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#D9D9D6] hover:border-[#CE1126] hover:text-[#CE1126] transition-colors flex-shrink-0"
            >
              <RotateCcw size={14} /> Borrar mi simulación
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <TabButton active={view === 'matches'} onClick={() => setView('matches')} icon={<ListChecks size={15} />} label="Partidos" />
            <TabButton active={view === 'table'} onClick={() => setView('table')} icon={<Table2 size={15} />} label="Tabla de Grupos" />
            <TabButton active={view === 'bracket'} onClick={() => setView('bracket')} icon={<Network size={15} />} label="Bracket Eliminación" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {view === 'matches' && <MatchesView groupResults={groupResults} officialResults={officialResults} setGroupScore={setGroupScore} />}
        {view === 'table' && <TableView standings={standings} top8ThirdPlace={top8ThirdPlace} allThirdPlaceTeams={allThirdPlaceTeams} />}
        {view === 'bracket' && (
          <BracketView
            getGroupPos={getGroupPos}
            top8ThirdPlace={top8ThirdPlace}
            koResults={koResults}
            setKoScore={setKoScore}
            setKoPenalty={setKoPenalty}
            getKoWinner={getKoWinner}
          />
        )}
      </div>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-xs text-[#6B6B6B] border-t border-[#D9D9D6]">
        Fixtures, fechas y sedes según el calendario oficial FIFA. Los resultados marcados como "Oficial" se actualizan
        por el administrador del sitio. Los partidos sin resultado oficial los puedes llenar tú — tu simulación se
        guarda solo en este navegador y no afecta lo que ven otras personas.
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
        active ? 'bg-[#CE1126] text-white' : 'bg-[#F2F8F5] text-[#006847] hover:text-[#CE1126]'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ===================== MATCHES VIEW =====================
function MatchesView({ groupResults, officialResults, setGroupScore }) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-2 bg-[#FFFFFF] border border-[#D9D9D6] rounded-xl p-4 text-sm text-[#1a1a1a]">
        <Info size={18} className="text-[#CE1126] flex-shrink-0 mt-0.5" />
        <p>
          Los partidos marcados <strong>Oficial</strong> ya tienen resultado real y no se pueden editar. En los partidos
          sin jugar puedes capturar tu propio marcador para simular — solo tú lo verás.
        </p>
      </div>

      {[1, 2, 3].map((md) => (
        <section key={md} className="mb-6">
          <h2 className="display text-xl text-[#CE1126] mb-3">Jornada {md}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GROUP_MATCHES.filter((m) => m.matchday === md).map((m) => {
              const r = groupResults[m.id] || {};
              const isOfficial = !!officialResults[m.id];
              const hasSimResult = !isOfficial && r.scoreA !== undefined && r.scoreB !== undefined && r.scoreA !== '' && r.scoreB !== '';
              return (
                <div key={m.id} className={`bg-[#FFFFFF] border rounded-xl p-3 ${isOfficial ? 'border-[#006847]' : 'border-[#D9D9D6]'}`}>
                  {/* Header: grupo + badge */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="bg-[#F2F8F5] text-[#CE1126] rounded px-1.5 py-0.5 font-bold text-xs">Grupo {m.group}</span>
                    {(isOfficial || hasSimResult) && (
                      <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 ${isOfficial ? 'bg-[#006847] text-white' : 'bg-[#CE1126] text-white'}`}>
                        {isOfficial ? '✓ OFICIAL' : '★ TU SIM'}
                      </span>
                    )}
                  </div>
                  {/* Fecha */}
                  <div className="flex items-center gap-1 text-xs text-[#1a1a1a] font-semibold mb-1">
                    <Calendar size={12} />
                    <span>{formatDate(m.date)}</span>
                  </div>
                  {/* Horarios */}
                  {m.timeET && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-[#e0e0e0] text-[#1a1a1a] rounded px-1.5 py-0.5 text-[10px] font-bold">🏟️ {m.timeLocal} local</span>
                      <span className="bg-[#4fc3f7] text-[#1a1a1a] rounded px-1.5 py-0.5 text-[10px] font-bold">🌴 {m.timeET} Miami</span>
                      <span className="bg-[#ffcc00] text-[#1a1a1a] rounded px-1.5 py-0.5 text-[10px] font-bold">🏈 {m.timeKansas} Kansas</span>
                      <span className="bg-[#4caf50] text-[#1a1a1a] rounded px-1.5 py-0.5 text-[10px] font-bold">🇲🇽 {m.timeCDMX} CDMX</span>
                    </div>
                  )}
                  {/* Sede */}
                  <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B] mb-2">
                    <MapPin size={11} />
                    <span>{m.venue}, {m.city}</span>
                  </div>
                  {['A', 'B'].map((side) => {
                    const team = side === 'A' ? m.teamA : m.teamB;
                    const score = side === 'A' ? r.scoreA ?? '' : r.scoreB ?? '';
                    return (
                      <div key={side} className="flex items-center justify-between py-1.5 px-2">
                        <span className="text-sm truncate flex-1">{team}</span>
                        <input
                          type="number"
                          min="0"
                          value={score}
                          onChange={(e) => setGroupScore(m.id, side === 'A' ? 'scoreA' : 'scoreB', e.target.value)}
                          disabled={isOfficial}
                          className="score-input w-12 bg-[#F4F4F2] border border-[#D9D9D6] rounded px-1.5 py-1 text-center text-sm font-bold text-[#1a1a1a] focus:outline-none focus:border-[#CE1126] disabled:opacity-60 disabled:bg-[#F2F8F5]"
                          aria-label={`Marcador ${team}`}
                          placeholder="-"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ===================== TABLE VIEW =====================
function TableView({ standings, top8ThirdPlace, allThirdPlaceTeams }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUP_LETTERS.map((group) => (
          <div key={group} className="bg-[#FFFFFF] border border-[#D9D9D6] rounded-xl overflow-hidden">
            <div className="bg-[#F2F8F5] px-4 py-2">
              <h3 className="display text-lg text-[#CE1126]">Grupo {group}</h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#6B6B6B] text-[10px]">
                  <th className="text-left pl-3 py-1.5">Equipo</th>
                  <th className="px-1">PJ</th>
                  <th className="px-1">DG</th>
                  <th className="px-1 pr-3">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings[group].map((t, idx) => {
                  const isThird = idx === 2;
                  const isQualified8 = isThird && top8ThirdPlace.some((q) => q.team === t.team && q.group === group);
                  return (
                    <tr key={t.team} className={`border-t border-[#E5E5E2] ${idx < 2 ? '' : isQualified8 ? '' : 'opacity-50'}`}>
                      <td className="pl-3 py-1.5 flex items-center gap-1.5">
                        <span className="w-4 text-center text-[10px] font-bold text-[#6B6B6B]">{idx + 1}</span>
                        <span className="truncate">{t.team}</span>
                        {idx < 2 && <span className="text-[9px] bg-[#CE1126] text-[#F4F4F2] rounded px-1 font-bold">Q</span>}
                        {isQualified8 && <span className="text-[9px] bg-[#006847] text-white rounded px-1 font-bold">3°</span>}
                      </td>
                      <td className="text-center px-1">{t.played}</td>
                      <td className="text-center px-1">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                      <td className="text-center px-1 pr-3 font-bold">{t.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#FFFFFF] border border-[#D9D9D6] rounded-xl p-4">
        <h3 className="display text-lg text-[#CE1126] mb-3">Ranking de Terceros Lugares</h3>
        <p className="text-xs text-[#6B6B6B] mb-3">Los 8 mejores (verde) avanzan a la Ronda de 32.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {allThirdPlaceTeams.map((t, idx) => (
            <div
              key={t.group}
              className={`rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
                idx < 8 ? 'bg-[#F2F8F5] border border-[#006847]' : 'bg-[#F4F4F2] border border-[#D9D9D6] opacity-60'
              }`}
            >
              <span className="truncate">{t.team}</span>
              <span className="text-[10px] text-[#6B6B6B] ml-2">{t.pts}pts {t.gd > 0 ? `+${t.gd}` : t.gd} · {t.group}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== ANNEX C: AUTO-ASSIGN THIRD PLACE TEAMS =====================
// Slot pools: which groups' 3rd-place CAN go to each R32 match slot
// Based on FIFA's official bracket template (Annex C structure)
const THIRD_PLACE_SLOT_POOLS = {
  74: ['A','B','C','D','F'],    // 1E vs 3rd from A/B/C/D/F
  77: ['C','D','F','G','H'],    // 1I vs 3rd from C/D/F/G/H
  79: ['C','E','F','H','I'],    // 1A vs 3rd from C/E/F/H/I
  80: ['E','H','I','J','K'],    // 1L vs 3rd from E/H/I/J/K
  81: ['B','E','F','I','J'],    // 1D vs 3rd from B/E/F/I/J
  82: ['A','E','H','I','J'],    // 1G vs 3rd from A/E/H/I/J
  85: ['E','F','G','I','J'],    // 1B vs 3rd from E/F/G/I/J
  87: ['D','E','I','J','L'],    // 1K vs 3rd from D/E/I/J/L
};

// Bipartite matching: assign each qualifying 3rd-place group to exactly one slot
// Returns { matchNum: group } or null if no valid assignment found
function assignThirdPlaces(top8Groups) {
  const slots = Object.keys(THIRD_PLACE_SLOT_POOLS).map(Number);
  const groups = [...top8Groups];

  function backtrack(slotIdx, assignment, usedGroups) {
    if (slotIdx === slots.length) return assignment;
    const slot = slots[slotIdx];
    const pool = THIRD_PLACE_SLOT_POOLS[slot];
    for (const g of pool) {
      if (groups.includes(g) && !usedGroups.has(g)) {
        usedGroups.add(g);
        const result = backtrack(slotIdx + 1, { ...assignment, [slot]: g }, usedGroups);
        if (result) return result;
        usedGroups.delete(g);
      }
    }
    return null;
  }

  return backtrack(0, {}, new Set());
}

// ===================== BRACKET VIEW =====================
function BracketView({ getGroupPos, top8ThirdPlace, koResults, setKoScore, setKoPenalty, getKoWinner }) {
  // Auto-assign 3rd place teams using Annex C algorithm
  const top8Groups = top8ThirdPlace.map(t => t.group);
  const thirdAssignment = useMemo(() => {
    if (top8Groups.length < 8) return null;
    return assignThirdPlaces(top8Groups);
  }, [top8Groups.join('')]);

  function getThirdPlaceTeam(matchNum) {
    if (!thirdAssignment) return null;
    const group = thirdAssignment[matchNum];
    if (!group) return null;
    return top8ThirdPlace.find(t => t.group === group);
  }

  const r32Matches = R32_TEMPLATE.map((m) => {
    let teamA, teamB;
    if (m.a.type === 'pos') teamA = getGroupPos(m.a.group, m.a.pos);
    else {
      const t = getThirdPlaceTeam(m.match);
      teamA = t ? `${t.team} (3°${t.group})` : m.a.label;
    }
    if (m.b.type === 'pos') teamB = getGroupPos(m.b.group, m.b.pos);
    else {
      const t = getThirdPlaceTeam(m.match);
      teamB = t ? `${t.team} (3°${t.group})` : m.b.label;
    }
    return { ...m, teamA, teamB };
  });

  const r16Matches = R16_TEMPLATE.map((m) => ({
    ...m,
    teamA: getKoWinner(m.a) || `Ganador P${m.a}`,
    teamB: getKoWinner(m.b) || `Ganador P${m.b}`,
  }));

  const qfMatches = QF_TEMPLATE.map((m) => ({
    ...m,
    teamA: getKoWinner(m.a) || `Ganador P${m.a}`,
    teamB: getKoWinner(m.b) || `Ganador P${m.b}`,
  }));

  const sfMatches = SF_TEMPLATE.map((m) => ({
    ...m,
    teamA: getKoWinner(m.a) || `Ganador P${m.a}`,
    teamB: getKoWinner(m.b) || `Ganador P${m.b}`,
  }));

  const finalMatch = {
    ...FINAL,
    teamA: getKoWinner(FINAL.a) || `Ganador P${FINAL.a}`,
    teamB: getKoWinner(FINAL.b) || `Ganador P${FINAL.b}`,
  };

  function getLoser(matchNum) {
    const r = koResults[matchNum];
    if (!r || !r.winner) return null;
    return r.winner === r.teamA ? r.teamB : r.teamA;
  }

  const thirdPlaceMatch = {
    ...THIRD_PLACE,
    teamA: getLoser(THIRD_PLACE.a) || `Perdedor P${THIRD_PLACE.a}`,
    teamB: getLoser(THIRD_PLACE.b) || `Perdedor P${THIRD_PLACE.b}`,
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#FFFFFF] border border-[#D9D9D6] rounded-xl p-4 text-sm text-[#1a1a1a] flex items-start gap-2">
        <Info size={18} className="text-[#CE1126] flex-shrink-0 mt-0.5" />
        <p>
          Los 1° y 2° lugares se llenan automáticamente desde la Tabla de Grupos.
          Los 8 mejores terceros se asignan automáticamente usando el algoritmo oficial de FIFA (Annex C).
          Captura marcadores; el ganador avanza solo. En empates, elige por penales.
        </p>
      </div>

      {/* Auto-assigned third place panel */}
      <section>
        <h2 className="display text-xl text-[#CE1126] mb-3">Terceros Lugares Asignados (Auto)</h2>
        {top8Groups.length < 8 ? (
          <div className="bg-[#F2F8F5] border border-[#D9D9D6] rounded-xl p-4 text-sm text-[#6B6B6B]">
            Completa más partidos de la fase de grupos para que los 8 mejores terceros queden definidos y se asignen automáticamente.
          </div>
        ) : !thirdAssignment ? (
          <div className="bg-[#FFF3F3] border border-[#CE1126] rounded-xl p-4 text-sm text-[#CE1126]">
            No se encontró una asignación válida para esta combinación de terceros. Revisa los resultados de grupos.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(thirdAssignment).map(([matchNum, group]) => {
              const team = top8ThirdPlace.find(t => t.group === group);
              return (
                <div key={matchNum} className="bg-[#F2F8F5] border border-[#006847] rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-[#6B6B6B]">P{matchNum}</span>
                  <span className="text-sm font-semibold">{team?.team}</span>
                  <span className="text-[10px] bg-[#006847] text-white rounded px-1.5 py-0.5 font-bold">3°{group}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <RoundSection title={ROUND_LABELS.r32} matches={r32Matches} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} />
      <RoundSection title={ROUND_LABELS.r16} matches={r16Matches} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} />
      <RoundSection title={ROUND_LABELS.qf} matches={qfMatches} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} />
      <RoundSection title={ROUND_LABELS.sf} matches={sfMatches} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} />

      <section>
        <h2 className="display text-xl text-[#CE1126] mb-3">{ROUND_LABELS.f}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MatchCard match={thirdPlaceMatch} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} highlight="bronze" />
          <MatchCard match={finalMatch} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} highlight="gold" />
        </div>
      </section>
    </div>
  );
}

function RoundSection({ title, matches, koResults, setKoScore, setKoPenalty }) {
  return (
    <section>
      <h2 className="display text-xl text-[#CE1126] mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {matches.map((m) => (
          <MatchCard key={m.match} match={m} koResults={koResults} setKoScore={setKoScore} setKoPenalty={setKoPenalty} />
        ))}
      </div>
    </section>
  );
}

function MatchCard({ match, koResults, setKoScore, setKoPenalty, highlight }) {
  const r = koResults[match.match] || {};
  const scoreA = r.scoreA ?? '';
  const scoreB = r.scoreB ?? '';
  const teamA = match.teamA;
  const teamB = match.teamB;
  const isTie = scoreA !== '' && scoreB !== '' && parseInt(scoreA) === parseInt(scoreB) && !isNaN(parseInt(scoreA));
  const winner = r.winner;
  const isPlaceholder =
    teamA?.startsWith('Ganador') || teamA?.startsWith('Mejor') || teamA?.startsWith('Perdedor') ||
    teamB?.startsWith('Ganador') || teamB?.startsWith('Mejor') || teamB?.startsWith('Perdedor');

  const borderColor = highlight === 'gold' ? 'border-[#CE1126]' : highlight === 'bronze' ? 'border-[#A0522D]' : 'border-[#D9D9D6]';

  return (
    <div className={`bg-[#FFFFFF] border ${borderColor} rounded-xl p-3`}>
      <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] mb-2">
        <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(match.date)}</span>
        <span className="flex items-center gap-1"><MapPin size={11} /> {match.city}</span>
      </div>
      <p className="text-[10px] text-[#6B6B6B] mb-2">{match.venue} · Partido {match.match}</p>

      {['A', 'B'].map((side) => {
        const team = side === 'A' ? teamA : teamB;
        const score = side === 'A' ? scoreA : scoreB;
        const isWinner = winner && winner === team;
        return (
          <div key={side} className={`flex items-center justify-between py-1.5 px-2 rounded ${isWinner ? 'bg-[#F2F8F5]' : ''}`}>
            <span className={`text-sm truncate flex-1 ${isWinner ? 'font-bold text-[#CE1126]' : ''}`}>{team}</span>
            <input
              type="number"
              min="0"
              value={score}
              onChange={(e) => {
                const val = e.target.value;
                if (side === 'A') setKoScore(match.match, teamA, teamB, val, scoreB);
                else setKoScore(match.match, teamA, teamB, scoreA, val);
              }}
              disabled={isPlaceholder}
              className="score-input w-12 bg-[#F4F4F2] border border-[#D9D9D6] rounded px-1.5 py-1 text-center text-sm font-bold text-[#1a1a1a] focus:outline-none focus:border-[#CE1126] disabled:opacity-40"
              aria-label={`Marcador ${team}`}
            />
          </div>
        );
      })}

      {isTie && (
        <div className="mt-2 pt-2 border-t border-[#D9D9D6]">
          <p className="text-[10px] text-[#6B6B6B] mb-1.5">Empate — ganador por penales:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setKoPenalty(match.match, teamA, teamB, teamA)}
              className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
                r.penWinner === teamA ? 'bg-[#CE1126] text-[#F4F4F2] border-[#CE1126]' : 'border-[#D9D9D6] hover:border-[#CE1126]'
              }`}
            >
              {teamA}
            </button>
            <button
              onClick={() => setKoPenalty(match.match, teamA, teamB, teamB)}
              className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
                r.penWinner === teamB ? 'bg-[#CE1126] text-[#F4F4F2] border-[#CE1126]' : 'border-[#D9D9D6] hover:border-[#CE1126]'
              }`}
            >
              {teamB}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
