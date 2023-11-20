#!/bin/bash

conda activate pypept
run_pyPept.py --fasta $1 
conda deactivate pypept