-- Migration 00006: Seed Demo Challans (Development Data)
-- Requires: 00002_create_tables.sql
-- NOTE: Run this only in development/staging environments

INSERT INTO challans (
  challan_number, notice_number, vehicle_number, dl_number,
  owner_name, owner_contact, owner_address,
  violation_date, challan_date, violation_type, violation_place,
  city, state,  fine_amount, applicable_section,
  payment_status, vehicle_class, vehicle_make,
  is_onoc, engine_number, chassis_number,
  number_plate_type, offender_age_group, offender_gender
) VALUES

-- Citizen 1 challans (Vehicle: GJ01UV9043)
('GJ4171692230721024001', 'DIA115_20230304154115_A1BC2', 'GJ01UV9043', 'GJ01 2019012345',
  'Raj Kumar Patel', '9876543210', '12, Vastrapur Road, Ahmedabad, Gujarat 380015',
  '2023-03-04 15:35:00+05:30', '2023-03-04 15:41:00+05:30', 'red_light', 'DIAMOND-DIAMOND_P2_L1',
  'Ahmedabad', 'Gujarat', 1000.00, '194D',
  'unpaid', 'two_wheeler', 'Honda Activa 6G',
  true, 'HA6GJHA6G1234567', 'ME4HA6GJ1234567', 'standard', '30_45', 'male'),

('GJ4171692230821034002', 'DIA116_20230821134035_B2CD3', 'GJ01UV9043', 'GJ01 2019012345',
  'Raj Kumar Patel', '9876543210', '12, Vastrapur Road, Ahmedabad, Gujarat 380015',
  '2023-08-21 13:28:00+05:30', '2023-08-21 13:40:00+05:30', 'no_helmet', 'DIAMOND-HELMET_CAM_02',
  'Ahmedabad', 'Gujarat', 500.00, '129(4)',
  'paid', 'two_wheeler', 'Honda Activa 6G',
  true, 'HA6GJHA6G1234567', 'ME4HA6GJ1234567', 'standard', '30_45', 'male'),

('GJ4171692231021054003', 'SRT115_20231021094015_C3DE4', 'GJ01UV9043', 'GJ01 2019012345',
  'Raj Kumar Patel', '9876543210', '12, Vastrapur Road, Ahmedabad, Gujarat 380015',
  '2023-10-21 09:35:00+05:30', '2023-10-21 09:40:00+05:30', 'overspeeding', 'NH48_KM_287_CAM3',
  'Surat', 'Gujarat', 2000.00, '194C',
  'unpaid', 'two_wheeler', 'Honda Activa 6G',
  true, 'HA6GJHA6G1234567', 'ME4HA6GJ1234567', 'standard', '30_45', 'male'),

-- Citizen 2 challans (Vehicle: GJ01BZ1234)
('GJ4171692230115024004', 'RJK118_20230115124015_D4EF5', 'GJ01BZ1234', 'GJ05 2020056789',
  'Priya Sharma', '8765432109', '45, Ashram Road, Rajkot, Gujarat 360001',
  '2023-01-15 12:33:00+05:30', '2023-01-15 12:40:00+05:30', 'signal_violation', 'RAJKOT_SIG_007',
  'Rajkot', 'Gujarat', 1000.00, '177A',
  'paid', 'four_wheeler', 'Maruti Swift',
  true, 'K12BGJK12B567890', 'MA3ERLF1S00567890', 'standard', '18_30', 'female'),

('GJ4171692230315044005', 'RJK119_20230315164515_E5FG6', 'GJ01BZ1234', 'GJ05 2020056789',
  'Priya Sharma', '8765432109', '45, Ashram Road, Rajkot, Gujarat 360001',
  '2023-03-15 16:38:00+05:30', '2023-03-15 16:45:00+05:30', 'no_seatbelt', 'RAJKOT_NH_008',
  'Rajkot', 'Gujarat', 1000.00, '194B',
  'disputed', 'four_wheeler', 'Maruti Swift',
  true, 'K12BGJK12B567890', 'MA3ERLF1S00567890', 'standard', '18_30', 'female'),

-- Citizen 3 (Vehicle: GJ06CD5678)
('GJ4171692230520064006', 'GND120_20230520104515_F6GH7', 'GJ06CD5678', 'GJ06 2018034567',
  'Amit Desai', '7654321098', '8, Sector 21, Gandhinagar, Gujarat 382021',
  '2023-05-20 10:38:00+05:30', '2023-05-20 10:45:00+05:30', 'wrong_lane', 'GND_CIRCLE4_CAM',
  'Gandhinagar', 'Gujarat', 500.00, '177',
  'waived', 'four_wheeler', 'Hyundai Creta',
  false, 'G4GJHCR1G4G678901', 'MALBM81CLJM678901', 'standard', '30_45', 'male'),

('GJ4171692230720084007', 'GND121_20230720144515_G7HI8', 'GJ06CD5678', 'GJ06 2018034567',
  'Amit Desai', '7654321098', '8, Sector 21, Gandhinagar, Gujarat 382021',
  '2023-07-20 14:38:00+05:30', '2023-07-20 14:45:00+05:30', 'parking_violation', 'GND_MG_ROAD_CAM2',
  'Gandhinagar', 'Gujarat', 500.00, '122',
  'unpaid', 'four_wheeler', 'Hyundai Creta',
  true, 'G4GJHCR1G4G678901', 'MALBM81CLJM678901', 'non_standard', '30_45', 'male'),

-- Citizen 4 (Vehicle: GJ05PQ9876)
('GJ4171692230215034008', 'VAD122_20230215094015_H8IJ9', 'GJ05PQ9876', 'GJ15 2021078901',
  'Meera Joshi', '6543210987', '3, Alkapuri, Vadodara, Gujarat 390007',
  '2023-02-15 09:28:00+05:30', '2023-02-15 09:40:00+05:30', 'pillion_overload', 'VAD_RC_CAM_003',
  'Vadodara', 'Gujarat', 2000.00, '128(A)',
  'paid', 'two_wheeler', 'TVS Jupiter',
  true, 'TVSJUPGJTVS789012', 'MD626BJ19D3789012', 'standard', '18_30', 'female'),

('GJ4171692230415054009', 'VAD123_20230415174515_I9JK0', 'GJ05PQ9876', 'GJ15 2021078901',
  'Meera Joshi', '6543210987', '3, Alkapuri, Vadodara, Gujarat 390007',
  '2023-04-15 17:38:00+05:30', '2023-04-15 17:45:00+05:30', 'document_violation', 'VAD_NH_CAM_007',
  'Vadodara', 'Gujarat', 5000.00, '196',
  'unpaid', 'two_wheeler', 'TVS Jupiter',
  true, 'TVSJUPGJTVS789012', 'MD626BJ19D3789012', 'standard', '18_30', 'female'),

-- Citizen 5 (Vehicle: GJ23MN4567)
('GJ4171692230625074010', 'SRT124_20230625124515_J0KL1', 'GJ23MN4567', 'GJ23 2017023456',
  'Suresh Mehta', '5432109876', '77, Ring Road, Surat, Gujarat 395001',
  '2023-06-25 12:28:00+05:30', '2023-06-25 12:45:00+05:30', 'red_light', 'SRT_DIAMOND4_CAM2',
  'Surat', 'Gujarat', 1000.00, '194D',
  'unpaid', 'four_wheeler', 'Tata Nexon',
  true, 'REVA1GJRE4A112345', 'MAT609651NHA12345', 'standard', 'above_45', 'male'),

('GJ4171692230825094011', 'SRT125_20230825164515_K1LM2', 'GJ23MN4567', 'GJ23 2017023456',
  'Suresh Mehta', '5432109876', '77, Ring Road, Surat, Gujarat 395001',
  '2023-08-25 16:28:00+05:30', '2023-08-25 16:45:00+05:30', 'overspeeding', 'SRT_ADAJAN_CAM5',
  'Surat', 'Gujarat', 1000.00, '183',
  'paid', 'four_wheeler', 'Tata Nexon',
  true, 'REVA1GJRE4A112345', 'MAT609651NHA12345', 'standard', 'above_45', 'male'),

-- Additional challans for analytics variety
('GJ4171692231115014012', 'AHM126_20231115094015_L2MN3', 'GJ01KP7890', NULL,
  'Dhruv Nair', '9988776655', '34, CG Road, Ahmedabad, Gujarat 380006',
  '2023-11-15 09:28:00+05:30', '2023-11-15 09:40:00+05:30', 'no_helmet', 'AHM_DRIVE_CAM_009',
  'Ahmedabad', 'Gujarat', 500.00, '129(4)',
  'paid', 'two_wheeler', 'Bajaj Pulsar 150',
  true, 'DTSII-GJDTS890123', 'MD2A13BT9GCJ890123', 'standard', 'below_18', 'male'),

('GJ4171692231215024013', 'AHM127_20231215124515_M3NO4', 'GJ01RS3456', NULL,
  'Kavya Pillai', '8877665544', '22, Navrangpura, Ahmedabad, Gujarat 380009',
  '2023-12-15 12:28:00+05:30', '2023-12-15 12:45:00+05:30', 'signal_violation', 'AHM_SG_HWY_CAM3',
  'Ahmedabad', 'Gujarat', 1000.00, '177A',
  'unpaid', 'four_wheeler', 'Honda City',
  true, 'GJGR8CNH01GR90123', 'MRHGM6820GP090123', 'standard', '18_30', 'female'),

('GJ4171692240115044014', 'RJK128_20240115144515_N4OP5', 'GJ14QR6543', NULL,
  'Yash Trivedi', '7766554433', '56, Kalawad Road, Rajkot, Gujarat 360005',
  '2024-01-15 14:28:00+05:30', '2024-01-15 14:45:00+05:30', 'wrong_lane', 'RJK_220_BYPASS_CAM',
  'Rajkot', 'Gujarat', 500.00, '177',
  'unpaid', 'two_wheeler', 'Royal Enfield Classic 350',
  true, 'GJUGRE350UGRE12345', 'MGZLRAAE0GWR12345', 'non_standard', '18_30', 'male'),

('GJ4171692240215054015', 'AHM129_20240215094015_O5PQ6', 'GJ01TU2109', NULL,
  'Nisha Rao', '6655443322', '89, Bopal, Ahmedabad, Gujarat 380058',
  '2024-02-15 09:28:00+05:30', '2024-02-15 09:40:00+05:30', 'parking_violation', 'AHM_BOPAL_CAM_011',
  'Ahmedabad', 'Gujarat', 500.00, '122',
  'paid', 'four_wheeler', 'Kia Seltos',
  true, 'GJKIA1CRGJ110234', 'MALAG51CLNM110234', 'standard', '30_45', 'female');
