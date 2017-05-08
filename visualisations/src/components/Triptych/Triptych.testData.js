/**
 * Triptych test data
 */
export default function triptychTestData() {
  return [
    {
      phenotype1: { label: 'PhenoALeft', informationContent: 7 },
      phenotype2: { label: 'PhenoARight', informationContent: 3 },
      similarity: 95
    },
    {
      phenotype1: { label: 'PhenoBLeft', informationContent: 6 },
      phenotype2: { label: 'PhenoBRight', informationContent: 4 },
      similarity: 50
    },
    {
      phenotype1: { label: 'PhenoCLeft', informationContent: 6 },
      phenotype2: { label: 'PhenoCRight', informationContent: 7 },
      similarity: 25
    },
    {
      phenotype1: { label: 'PhenoDLeft', informationContent: 2 },
      phenotype2: { label: 'PhenoDRight', informationContent: 8},
      similarity: 17
    },
    {
      phenotype1: { label: 'PhenoELeft', informationContent: 5 },
      phenotype2: { label: 'PhenoERight', informationContent: 4 },
      similarity: 66
    },
    {
      phenotype1: { label: 'PhenoFLeft', informationContent: 6 },
      phenotype2: { label: 'PhenoFRight', informationContent: 3 },
      similarity: 80
    },
  ];
}