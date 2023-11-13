// Function to calculate the coefficient for a single amino acid
function getAminoAcidCoefficient(aa) {
  switch (aa) {
    case "A":
      return 1.34; //1.32
    case "R":
      return 0.46; //0.49
    case "N":
      return 0.97; //0.96
    case "D":
      return 0.63; //0.73
    case "C":
      return 1.09; //1.07
    case "Q":
      return 0.79; //0.82
    case "E":
      return 1.1; //1.16
    case "G":
      return 0.81; //0.9
    case "H":
      return 0.64; //0.4
    case "I":
      return 1.58; //1.53
    case "L":
      return 1.2; //1.18
    case "K":
      return 1.31; //1.19
    case "M":
      return 1.15; //1.34
    case "F":
      return 1.07; //1.16
    case "P":
      return 0.26; //0.49
    case "S":
      return 0.69; //0.89
    case "T":
      return 1.15; //1.1
    case "W":
      return 1.01; //0.91
    case "Y":
      return 1.12; //1.03
    case "V":
      return 1.77; //1.45
    case "X":
    case "J":
    case "Z":
      return 0.4;
    default:
      return 0.9;
  }
}

let KDValues = {
  I: 4.5,
  V: 4.2,
  L: 3.8,
  F: 2.8,
  C: 2.5,
  M: 1.9,
  A: 1.8,
  G: -0.4,
  T: -0.7,
  S: -0.8,
  W: -0.9,
  Y: -1.3,
  P: -1.6,
  H: -3.2,
  E: -3.5,
  Q: -3.5,
  D: -3.5,
  N: -3.5,
  K: -3.9,
  R: -4.5,
};

export const difficultyCouplingCalc = (sequence) => {
  var minval = Number.MAX_VALUE;
  var maxval = Number.MIN_VALUE;

  // Define arrays to store results
  var AmAc = [];
  var diffseq = [];

  // Initialize a variable to track repeated undefined amino acids
  var repeatmsg = 0;

  // Iterate over the sequence
  for (var n = 0; n < sequence.length; n++) {
    var aa = sequence[n];
    AmAc[n] = aa;

    // Check if it's possible to create a pentamer from the current position
    if (n + 4 < sequence.length) {
      var pentamer = sequence.substr(n, 5);
      var difcoef = 0;

      for (var m = 0; m < 5; m++) {
        var AA = pentamer[m].toUpperCase();
        var aacoef = getAminoAcidCoefficient(AA);

        // If the amino acid is undefined, handle it
        if (aacoef === 0.4) {
          repeatmsg++;
          if (repeatmsg === 5) repeatmsg = 0;
          if (repeatmsg === 1)
            console.log(AA + " is not defined, using average value");
        }

        difcoef += aacoef;
      }

      var averageCoef = difcoef / 5;
      diffseq[n] = averageCoef.toFixed(2);

      minval = minval < averageCoef ? minval : averageCoef;
      maxval = maxval > averageCoef ? maxval : averageCoef;
    } else {
      diffseq[n] = (0.88).toFixed(2);
      minval = minval < 0.88 ? minval : 0.88;
      maxval = maxval > 0.88 ? maxval : 0.88;
    }
  }

  maxval = parseFloat(maxval.toFixed(2));
  minval = parseFloat(minval.toFixed(2));

  // Return the results
  return [diffseq, AmAc, [minval, maxval]];
};

export const KdPlotValueCalc = (sequence) => {
  let data = [];
  // Iterate over the sequence
  for (var n = 0; n < sequence.length; n++) {
    if (n + 4 < sequence.length) {
      let valueAtIdx = 0;
      
      let pentamer = sequence.substr(n, 5);
      for(let i=0; i<pentamer.length; i++){
        valueAtIdx += KDValues[pentamer[i]];
      };

      data.push({x:n+1, y:valueAtIdx/5});
    }
  }

  return data;
};
