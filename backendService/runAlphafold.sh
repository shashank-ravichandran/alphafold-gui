#!/bin/bash
alphafoldCmd="colabfold_batch"
working_dir=""
inputSeq=""

while getopts 'atr:f:s:' OPTION; do
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
    s)
        inputSeq=$OPTARG
    ;;
    esac
done

$alphafoldCmd
./generate2dImage.sh $inputSeq
echo "Success" > $working_dir/status.txt
cp $working_dir/*_relaxed_rank_001_alphafold2_ptm_model_* $working_dir/final_structure.pdb
cd $working_dir && zip -r ./result_files_compressed.zip ./*
