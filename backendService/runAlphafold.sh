#!/bin/bash
alphafoldCmd="colabfold_batch"
working_dir=""

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
        working_dir="/home/ragothaman/alphafold-gui/backendService/inputFiles/$OPTARG"
        alphafoldCmd="$alphafoldCmd --use-gpu-relax $working_dir/$OPTARG.csv $working_dir"
    ;;
    esac
done

$alphafoldCmd
echo "Success" > $working_dir/status.txt
