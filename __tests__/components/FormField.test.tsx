import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FormField from '../../components/product-page/FormField';

describe('FormField component', () => {
  it('renders the label text', () => {
    render(
      <FormField label="Phone Number">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('shows an asterisk (*) when required=true', () => {
    render(
      <FormField label="First Name" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does NOT show an asterisk when required is omitted', () => {
    render(
      <FormField label="Alt Phone">
        <input />
      </FormField>,
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders children inside the field wrapper', () => {
    render(
      <FormField label="Address">
        <textarea data-testid="addr-input" />
      </FormField>,
    );
    expect(screen.getByTestId('addr-input')).toBeInTheDocument();
  });

  it('shows an error message when error prop is provided', () => {
    render(
      <FormField label="Phone Number" error="Enter a valid Nigerian number">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Enter a valid Nigerian number')).toBeInTheDocument();
  });

  it('does NOT render an error element when error is undefined', () => {
    render(
      <FormField label="Phone Number">
        <input />
      </FormField>,
    );
    // No <p> with error class should exist
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
