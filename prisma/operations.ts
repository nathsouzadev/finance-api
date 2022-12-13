const getTestDate = () => {
    const today = new Date()
    const yesterday = new Date()
    const otherDay = new Date()
    const dayOutOfRange = new Date()

    yesterday.setDate(yesterday.getDate() - 1)
    otherDay.setDate(otherDay.getDate() - 15)
    dayOutOfRange.setDate(dayOutOfRange.getDate() - 92)

    return {
      today: today.toISOString().split('T')[0],
      yesterday: yesterday.toISOString().split('T')[0],
      otherDay: otherDay.toISOString().split('T')[0],
      dayOutOfRange: dayOutOfRange.toISOString().split('T')[0]
    }
}

export const operations = [
  {
    createdAt: new Date(getTestDate().today),
    description: 'Salary',
    value: 3500,
  },
  {
    createdAt: new Date(getTestDate().today),
    description: 'Food',
    value: -10,
  },
  {
    createdAt: new Date(getTestDate().yesterday),
    description: 'Food',
    value: -3.67,
  },
  {
    createdAt: new Date(getTestDate().yesterday),
    description: 'Car',
    value: -253.49,
  },
  {
    createdAt: new Date(getTestDate().otherDay),
    description: 'Tax',
    value: -300.0,
  },
  {
    createdAt: new Date(getTestDate().otherDay),
    description: 'PIX',
    value: -900,
  },
  {
    createdAt: new Date(getTestDate().dayOutOfRange),
    description: 'Card',
    value: -754.23,
  },
  {
    createdAt: new Date(getTestDate().dayOutOfRange),
    description: 'Cashback',
    value: 30,
  },
];
