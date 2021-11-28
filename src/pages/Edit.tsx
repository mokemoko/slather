import React from 'react'
import { Box, Grid, Paper, Stack } from '@mui/material'

interface Props {

}

const Edit = ({}: Props): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <Paper sx={{height: 300}}>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper sx={{height: 300}}>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{height: 300}}>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Edit
