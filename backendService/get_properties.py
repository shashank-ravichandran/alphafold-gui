from Bio.SeqUtils.ProtParam import ProteinAnalysis
import sys

# Protein sequence to analyze
protein_sequence = sys.argv[1]

# Perform protein analysis
protein_analysis = ProteinAnalysis(protein_sequence)

# Retrieve properties
molecular_weight = protein_analysis.molecular_weight()
gravy_score = protein_analysis.gravy()
isoelectric_point = protein_analysis.isoelectric_point()
charge = protein_analysis.charge_at_pH(isoelectric_point)

# Write the extracted properties
with open( sys.argv[2] + "/properties.txt","w") as f_handle:
    f_handle.write('Molecular Weight:', molecular_weight)
    f_handle.write('Charge at Isoelectric Point:', charge)
    f_handle.write('Isoelectric Point:', isoelectric_point)
    f_handle.write('GRAVY Score:', gravy_score)
