#!/bin/bash
alphafoldCmd="nohup colabfold_batch"

while getopts 'atr:f:' OPTION; do
    case "$OPTION" in
    a)
        alphafoldCmd="$alphafoldCmd --amber"
        ;;
    t)
        alphafoldCmd="$alphafoldCmd --templates"
        ;;
    r)
        alphafoldCmd="$alphafoldCmd --num-recycle $OPTARG"
        ;;
    f)
        alphafoldCmd="$alphafoldCmd --use-gpu-relax $OPTARG.csv $OPTARG &"
    ;;
    esac
done

echo $alphafoldCmd
